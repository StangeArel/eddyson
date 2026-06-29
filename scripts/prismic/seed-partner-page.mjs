import { randomUUID } from 'node:crypto';
import * as prismic from '@prismicio/client';

const repositoryName = process.env.PRISMIC_REPOSITORY_NAME ?? 'eddyson';
const writeToken = process.env.PRISMIC_WRITE_TOKEN;
const partnerLandingPageDocumentId = process.env.PRISMIC_PARTNER_LANDING_PAGE_ID;

if (!writeToken) {
  console.error('Missing PRISMIC_WRITE_TOKEN.');
  console.error('Create a Migration API write token in Prismic and run:');
  console.error('PRISMIC_WRITE_TOKEN=... npm run prismic:seed:page');
  process.exit(1);
}

const readClient = prismic.createClient(repositoryName);
const writeClient = prismic.createWriteClient(repositoryName, { writeToken });
const migration = prismic.createMigration();
const assetApiEndpoint = process.env.PRISMIC_ASSET_API_ENDPOINT ?? 'https://asset-api.prismic.io';

const createSliceId = (sliceType) => `${sliceType}$${randomUUID()}`;
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const heading = (type, text) => [
  {
    type,
    text,
    spans: [],
  },
];

const paragraph = (text) => [
  {
    type: 'paragraph',
    text,
    spans: [],
  },
];

const asset = (_path, filename, alt) => ({
  filename,
  alt,
});

const createImageField = (mediaAsset, alt) => {
  if (!mediaAsset.width || !mediaAsset.height) {
    throw new Error(`Missing image dimensions for ${mediaAsset.filename}.`);
  }

  return {
    id: mediaAsset.id,
    url: mediaAsset.url,
    dimensions: {
      width: mediaAsset.width,
      height: mediaAsset.height,
    },
    alt: alt || mediaAsset.alt || null,
    copyright: mediaAsset.credits || null,
  };
};

const fetchAssetPage = async (url) => {
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const response = await fetch(url, {
      headers: {
        repository: repositoryName,
        authorization: `Bearer ${writeToken}`,
      },
    });

    if (response.status !== 429) {
      return response;
    }

    const retryAfter = Number(response.headers.get('retry-after')) || attempt * 10;
    console.log(`Prismic Asset API rate limit, retrying in ${retryAfter}s.`);
    await sleep(retryAfter * 1000);
  }

  return fetch(url, {
    headers: {
      repository: repositoryName,
      authorization: `Bearer ${writeToken}`,
    },
  });
};

const fetchAllMediaAssets = async () => {
  const mediaAssets = [];
  let cursor;

  for (;;) {
    const url = new URL('assets', assetApiEndpoint);

    url.searchParams.set('pageSize', '100');

    if (cursor) {
      url.searchParams.set('cursor', cursor);
    }

    const response = await fetchAssetPage(url);

    if (!response.ok) {
      throw new Error(`Prismic Asset API failed: ${response.status} ${await response.text()}`);
    }

    const result = await response.json();

    mediaAssets.push(...(result.items ?? []));
    cursor = result.cursor;

    if (!cursor) {
      return mediaAssets;
    }
  }
};

const mediaAssetsByFilename = new Map(
  (await fetchAllMediaAssets()).map((mediaAsset) => [mediaAsset.filename, mediaAsset]),
);

const migrate = async () =>
  writeClient.migrate(migration, {
    reporter(event) {
      if (event.type === 'assets:creating') {
        console.log(
          `Uploading asset ${event.data.current}/${event.data.total}: ${event.data.asset.config.filename}`,
        );
      }

      if (event.type === 'documents:updating') {
        console.log(`Updating document ${event.data.current}/${event.data.total}`);
      }
    },
  });

const createAssetMap = async (configs) =>
  Object.fromEntries(
    Object.entries(configs).map(([key, config]) => {
      const mediaAsset = mediaAssetsByFilename.get(config.filename);

      if (!mediaAsset) {
        throw new Error(`Missing media library asset: ${config.filename}`);
      }

      return [key, createImageField(mediaAsset, config.alt)];
    }),
  );

const heroAssets = await createAssetMap({
  dotBackground: asset(
    './assets/hero/rectangle-4089.png',
    'rectangle-4089.png',
    'Dotted hero background',
    ['hero'],
  ),
  gradientOverlay: asset(
    './assets/hero/rectangle-4090.svg',
    'rectangle-4090.svg',
    'Hero gradient overlay',
    ['hero'],
  ),
  requestPanelImage: asset(
    './assets/hero-ui/request-list-panel.png',
    'request-list-panel.png',
    'All requests panel',
    ['hero'],
  ),
  metricCardImage: asset(
    './assets/hero-ui/projected-inventory-card.png',
    'projected-inventory-card.png',
    'Projected inventory card',
    ['hero'],
  ),
  mediaCardImage: asset(
    './assets/hero-ui/video-thumbnail-card.png',
    'video-thumbnail-card.png',
    'Partner video thumbnail',
    ['hero'],
  ),
});

const logoAssets = await createAssetMap({
  bauhaus: asset('./assets/customer-logos/bauhaus.svg', 'bauhaus.svg', 'Bauhaus', [
    'customer-logo',
  ]),
  wagner: asset('./assets/customer-logos/wagner.svg', 'wagner.svg', 'Wagner', [
    'customer-logo',
  ]),
  lekkerland: asset(
    './assets/customer-logos/lekkerland.svg',
    'lekkerland.svg',
    'Lekkerland',
    ['customer-logo'],
  ),
  bbraun: asset('./assets/customer-logos/bbraun.svg', 'bbraun.svg', 'B. Braun', [
    'customer-logo',
  ]),
  tdk: asset('./assets/customer-logos/tdk.svg', 'tdk.svg', 'TDK', ['customer-logo']),
  nord: asset('./assets/customer-logos/nord.svg', 'nord.svg', 'NORD DRIVESYSTEMS', [
    'customer-logo',
  ]),
  jockey: asset('./assets/customer-logos/jockey.svg', 'jockey.svg', 'Jockey', [
    'customer-logo',
  ]),
  mitegro: asset('./assets/customer-logos/mitegro.svg', 'mitegro.svg', 'MITEGRO', [
    'customer-logo',
  ]),
  spax: asset('./assets/customer-logos/spax.svg', 'spax.svg', 'SPAX', ['customer-logo']),
  erichJaeger: asset(
    './assets/customer-logos/erich-jaeger.svg',
    'erich-jaeger.svg',
    'ERICH JAEGER',
    ['customer-logo'],
  ),
});

const processAssets = await createAssetMap({
  ribbon: asset(
    './assets/partner-program/ribbon-frame.svg',
    'ribbon-frame.svg',
    'Partner program ribbon background',
    ['partner-program'],
  ),
  connect: asset(
    './assets/partner-program/connect-handshake.png',
    'connect-handshake.png',
    'Connect phase',
    ['partner-program'],
  ),
  quality: asset(
    './assets/partner-program/quality-exchange.png',
    'quality-exchange.png',
    'Quality phase',
    ['partner-program'],
  ),
  launch: asset(
    './assets/partner-program/launch-team.png',
    'launch-team.png',
    'Launch phase',
    ['partner-program'],
  ),
});

const benefitAssets = await createAssetMap({
  grow: asset('./assets/benefits/grow.avif', 'grow.avif', 'Grow together', ['benefit']),
  earn: asset('./assets/benefits/earn.avif', 'earn.avif', 'Earn as you go', ['benefit']),
  technology: asset(
    './assets/benefits/technology.avif',
    'technology.avif',
    'Innovative technology',
    ['benefit'],
  ),
  diverse: asset(
    './assets/benefits/diverse.avif',
    'diverse.avif',
    'Diverse partner program',
    ['benefit'],
  ),
  competitive: asset(
    './assets/benefits/competitive.avif',
    'competitive.avif',
    'Competitive advantages',
    ['benefit'],
  ),
  collaboration: asset(
    './assets/benefits/collaboration.avif',
    'collaboration.avif',
    'Long-term collaboration',
    ['benefit'],
  ),
});

const contactAssets = await createAssetMap({
  background: asset(
    './assets/contact/bottom-bg.png',
    'bottom-bg.png',
    'Contact section background pattern',
    ['contact'],
  ),
});

const heroSection = {
  id: createSliceId('hero_section'),
  slice_type: 'hero_section',
  slice_label: null,
  variation: 'default',
  version: 'initial',
  primary: {
    title: heading('heading1', 'Your partner in the EDI jungle'),
    teaser_label: 'Select. Connect. Evolve.',
    teaser_title: 'Fast + Scalable + Successful',
    teaser_text: paragraph(
      'At eddyson, we believe in technology that connects and partnerships that last. Together, we help you support customers in industries such as automotive, grocery, and retail with EDI solutions that simplify processes, accelerate projects, and give you a competitive edge.',
    ),
    secondary_button_label: 'Partner benefits',
    secondary_button_link: {
      link_type: 'Web',
      url: '#partner-benefits',
    },
    primary_button_label: 'Become a partner',
    primary_button_link: {
      link_type: 'Web',
      url: '#partner-contact',
    },
    dot_background: heroAssets.dotBackground,
    gradient_overlay: heroAssets.gradientOverlay,
    request_panel_image: heroAssets.requestPanelImage,
    metric_card_image: heroAssets.metricCardImage,
    media_card_image: heroAssets.mediaCardImage,
  },
  items: [],
};

const customerLogoStrip = {
  id: createSliceId('customer_logo_strip'),
  slice_type: 'customer_logo_strip',
  slice_label: null,
  variation: 'default',
  version: 'initial',
  primary: {
    aria_label: 'Customer logos',
  },
  items: [
    { logo: logoAssets.bauhaus, name: 'Bauhaus' },
    { logo: logoAssets.wagner, name: 'Wagner' },
    { logo: logoAssets.lekkerland, name: 'Lekkerland' },
    { logo: logoAssets.bbraun, name: 'B. Braun' },
    { logo: logoAssets.tdk, name: 'TDK' },
    { logo: logoAssets.nord, name: 'NORD DRIVESYSTEMS' },
    { logo: logoAssets.jockey, name: 'Jockey' },
    { logo: logoAssets.mitegro, name: 'MITEGRO' },
    { logo: logoAssets.spax, name: 'SPAX' },
    { logo: logoAssets.erichJaeger, name: 'ERICH JAEGER' },
  ],
};

const partnerProcessSection = {
  id: createSliceId('partner_process_section'),
  slice_type: 'partner_process_section',
  slice_label: null,
  variation: 'default',
  version: 'initial',
  primary: {
    eyebrow: 'Partner program',
    title: heading('heading2', 'Efficient processes right from the start'),
    text: paragraph(
      'Choosing eddyson means choosing a partnership built on trust, quality, and strategic foresight. Our 3-phase program lays the foundation for long-term success.',
    ),
    ribbon_image: processAssets.ribbon,
  },
  items: [
    {
      image: processAssets.connect,
      title: 'Connect',
      description: paragraph(
        'Use our form to get in touch with us. Share the most important information about your use case at a glance.',
      ),
    },
    {
      image: processAssets.quality,
      title: 'Quality',
      description: paragraph(
        'In personal conversations, we align expectations, define requirements, and shape our joint path forward.',
      ),
    },
    {
      image: processAssets.launch,
      title: 'Launch',
      description: paragraph(
        'With Select. Connect. Evolve, we onboard your customers, continuously exchange ideas, and grow side by side.',
      ),
    },
  ],
};

const expertiseSection = {
  id: createSliceId('expertise_section'),
  slice_type: 'expertise_section',
  slice_label: null,
  variation: 'default',
  version: 'initial',
  primary: {
    title: heading('heading2', 'You Sell ERP and IT Solutions, We Provide EDI Expertise'),
    text: paragraph(
      "Journey through the EDI Jungle: The perfect combination for holistic digital offerings. By combining expertise from different fields, we meet and exceed your customers' needs. We deliver scalable EDI solutions that create an effective IT landscape.",
    ),
  },
  items: [],
};

const partnershipModelSection = {
  id: createSliceId('partnership_model_section'),
  slice_type: 'partnership_model_section',
  slice_label: null,
  variation: 'default',
  version: 'initial',
  primary: {
    question: 'Do you have a different partnership model in mind?',
    link_label: "Let's talk.",
    link: {
      link_type: 'Web',
      url: '#partner-contact',
    },
  },
  items: [],
};

const benefitsSection = {
  id: createSliceId('benefits_section'),
  slice_type: 'benefits_section',
  slice_label: null,
  variation: 'default',
  version: 'initial',
  primary: {
    aria_label: 'Partner benefits',
  },
  items: [
    {
      image: benefitAssets.grow,
      title: 'Grow together',
      description: paragraph(
        "With ongoing activities, consulting, and support, we help scale your business and your customers' growth.",
      ),
      style_key: 'grow',
    },
    {
      image: benefitAssets.earn,
      title: 'Earn as you go',
      description: paragraph('Benefit from our commission model while driving customer projects.'),
      style_key: 'earn',
    },
    {
      image: benefitAssets.technology,
      title: 'Innovative technology',
      description: paragraph(
        'Our business partner network replaces traditional, complex 1:1 mappings.',
      ),
      style_key: 'technology',
    },
    {
      image: benefitAssets.diverse,
      title: 'Diverse partner program',
      description: paragraph(
        'Benefit from a wide range of support, training, and joint activities.',
      ),
      style_key: 'diverse',
    },
    {
      image: benefitAssets.competitive,
      title: 'Competitive advantages',
      description: paragraph(
        'Deliver scalable EDI solutions with reusable ERP connectors and generate revenue at the same time.',
      ),
      style_key: 'competitive',
    },
    {
      image: benefitAssets.collaboration,
      title: 'Long-term collaboration',
      description: paragraph('We build sustainable success together with you.'),
      style_key: 'collaboration',
    },
  ],
};

const contactField = (label, placeholder, fieldType, requiredLabel = '') => ({
  label,
  placeholder,
  field_type: fieldType,
  required_label: requiredLabel,
});

const contactOption = (label) => contactField(label, '', 'select', 'option');

const contactSection = {
  id: createSliceId('contact_section'),
  slice_type: 'contact_section',
  slice_label: null,
  variation: 'default',
  version: 'initial',
  primary: {
    title: heading('heading2', 'Your First Step Toward Partnership with eddyson'),
    text: paragraph(
      'Want to learn more about partnering with eddyson or become a partner straight away? Fill out the form below to get in touch. The more details you provide, the better we can address your needs. Our partner management team will reach out to you shortly.',
    ),
    background_image: contactAssets.background,
    submit_label: 'Submit',
    privacy_text: 'By submitting this form, I agree with the privacy policy',
    privacy_link: {
      link_type: 'Web',
      url: '/privacy-policy',
    },
  },
  items: [
    contactField('First and Last name', 'Valery Jacobson jr III', 'text', 'required'),
    contactField('Company', 'Your company', 'text', 'required'),
    contactField('Business email', 'you@yourcompany.com', 'email', 'required'),
    contactField('Phone', '', 'tel', 'required'),
    contactField('Partner type', 'Select at least one', 'select', 'required'),
    contactOption('Implementation Partner'),
    contactOption('Sales Partner'),
    contactOption('Other'),
    contactField('Industry', 'Select at least one', 'select', 'required'),
    contactOption('Automotive'),
    contactOption('Grocery'),
    contactOption('Logistics'),
    contactOption('Retail'),
    contactOption('Production'),
    contactField('System focus', 'e.g. SAP, Microsoft', 'text'),
    contactField(
      'Questions or comments',
      'Anything you would like to add for optimal feedback',
      'textarea',
    ),
  ],
};

const pageBody = [
  heroSection,
  customerLogoStrip,
  partnerProcessSection,
  expertiseSection,
  partnershipModelSection,
  benefitsSection,
  contactSection,
];

const requestedSliceTypes = (process.env.PRISMIC_SEED_SLICE_TYPES ?? '')
  .split(',')
  .map((sliceType) => sliceType.trim())
  .filter(Boolean);
const logoLimit = Number(process.env.PRISMIC_LOGO_LIMIT ?? 0);

if (logoLimit > 0) {
  customerLogoStrip.items = customerLogoStrip.items.slice(0, logoLimit);
}

const seededPageBody = requestedSliceTypes.length
  ? pageBody.filter((slice) => requestedSliceTypes.includes(slice.slice_type))
  : pageBody;

const updatePartnerLandingPageById = async (documentId) => {
  migration.updateDocument(
    {
      id: documentId,
      lang: 'en-us',
      type: 'partner_landing_page',
      data: {
        body: seededPageBody,
      },
    },
    'Partner Landing Page',
  );

  await migrate();
};

const getExistingPartnerLandingPage = async () => {
  try {
    return await readClient.getSingle('partner_landing_page');
  } catch {
    return null;
  }
};

if (partnerLandingPageDocumentId) {
  await updatePartnerLandingPageById(partnerLandingPageDocumentId);
  console.log('Partner landing page content was sent to Prismic.');
  process.exit(0);
}

const existingPage = await getExistingPartnerLandingPage();

if (existingPage) {
  migration.updateDocument(
    {
      ...existingPage,
      data: {
        ...existingPage.data,
        body: seededPageBody,
      },
    },
    'Partner Landing Page',
  );
} else {
  migration.createDocument(
    {
      lang: 'en-us',
      type: 'partner_landing_page',
      data: {
        body: seededPageBody,
      },
    },
    'Partner Landing Page',
  );
}

await migrate();

console.log('Partner landing page content was sent to Prismic.');
