import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import * as prismic from '@prismicio/client';

const repositoryName = process.env.PRISMIC_REPOSITORY_NAME ?? 'eddyson';
const writeToken = process.env.PRISMIC_WRITE_TOKEN;
const partnerLandingPageDocumentId = process.env.PRISMIC_PARTNER_LANDING_PAGE_ID;
const heroSectionSliceId =
  process.env.PRISMIC_HERO_SECTION_SLICE_ID ?? `hero_section$${randomUUID()}`;

const heroAssetConfigs = {
  dotBackground: {
    fileUrl: new URL('../../public/assets/hero/rectangle-4089.png', import.meta.url),
    filename: 'rectangle-4089.png',
    alt: 'Dotted hero background',
  },
  gradientOverlay: {
    fileUrl: new URL('../../public/assets/hero/rectangle-4090.svg', import.meta.url),
    filename: 'rectangle-4090.svg',
    alt: 'Hero gradient overlay',
  },
  requestPanelImage: {
    fileUrl: new URL('../../public/assets/hero-ui/request-list-panel.png', import.meta.url),
    filename: 'request-list-panel.png',
    alt: 'All requests panel',
  },
  metricCardImage: {
    fileUrl: new URL('../../public/assets/hero-ui/projected-inventory-card.png', import.meta.url),
    filename: 'projected-inventory-card.png',
    alt: 'Projected inventory card',
  },
  mediaCardImage: {
    fileUrl: new URL('../../public/assets/hero-ui/video-thumbnail-card.png', import.meta.url),
    filename: 'video-thumbnail-card.png',
    alt: 'Partner video thumbnail',
  },
};

if (!writeToken) {
  console.error('Missing PRISMIC_WRITE_TOKEN.');
  console.error('Create a Migration API write token in Prismic and run:');
  console.error('PRISMIC_WRITE_TOKEN=... npm run prismic:seed:hero');
  process.exit(1);
}

const readClient = prismic.createClient(repositoryName);
const writeClient = prismic.createWriteClient(repositoryName, { writeToken });
const migration = prismic.createMigration();

const createHeroAsset = async ({ fileUrl, filename, alt }) => {
  const file = await readFile(fileUrl);

  return migration.createAsset(file, filename, {
    alt,
    tags: ['hero'],
  });
};

const createHeroAssets = async () => ({
  dotBackground: await createHeroAsset(heroAssetConfigs.dotBackground),
  gradientOverlay: await createHeroAsset(heroAssetConfigs.gradientOverlay),
  requestPanelImage: await createHeroAsset(heroAssetConfigs.requestPanelImage),
  metricCardImage: await createHeroAsset(heroAssetConfigs.metricCardImage),
  mediaCardImage: await createHeroAsset(heroAssetConfigs.mediaCardImage),
});

const createHeroSection = async () => {
  const heroAssets = await createHeroAssets();

  return {
    id: heroSectionSliceId,
    slice_type: 'hero_section',
    slice_label: null,
    variation: 'default',
    version: 'initial',
    primary: {
      title: [
        {
          type: 'heading1',
          text: 'Your partner in the EDI jungle',
          spans: [],
        },
      ],
      teaser_label: 'Select. Connect. Evolve.',
      teaser_title: 'Fast + Scalable + Successful',
      teaser_text: [
        {
          type: 'paragraph',
          text: 'At eddyson, we believe in technology that connects and partnerships that last. Together, we help you support customers in industries such as automotive, grocery, and retail with EDI solutions that simplify processes, accelerate projects, and give you a competitive edge.',
          spans: [],
        },
      ],
      secondary_button_label: 'Partner benefits',
      secondary_button_link: {
        link_type: 'Web',
        url: '#partner-benefits',
      },
      primary_button_label: 'Become a partner',
      primary_button_link: {
        link_type: 'Web',
        url: '#contact',
      },
      dot_background: heroAssets.dotBackground,
      gradient_overlay: heroAssets.gradientOverlay,
      request_panel_image: heroAssets.requestPanelImage,
      metric_card_image: heroAssets.metricCardImage,
      media_card_image: heroAssets.mediaCardImage,
    },
    items: [],
  };
};

const updatePartnerLandingPageById = async (documentId, heroSection) => {
  migration.updateDocument(
    {
      id: documentId,
      lang: 'en-us',
      type: 'partner_landing_page',
      data: {
        body: [heroSection],
      },
    },
    'Partner Landing Page',
  );

  await writeClient.migrate(migration);
};

const getExistingPartnerLandingPage = async () => {
  try {
    return await readClient.getSingle('partner_landing_page');
  } catch {
    return null;
  }
};

const heroSection = await createHeroSection();

if (partnerLandingPageDocumentId) {
  await updatePartnerLandingPageById(partnerLandingPageDocumentId, heroSection);
  console.log('Hero section content was sent to Prismic.');
  process.exit(0);
}

const existingPage = await getExistingPartnerLandingPage();

if (existingPage) {
  const bodyWithoutHero = (existingPage.data.body ?? []).filter(
    (slice) => slice.slice_type !== 'hero_section',
  );

  migration.updateDocument(
    {
      ...existingPage,
      data: {
        ...existingPage.data,
        body: [heroSection, ...bodyWithoutHero],
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
        body: [heroSection],
      },
    },
    'Partner Landing Page',
  );
}

await writeClient.migrate(migration);

console.log('Hero section content was sent to Prismic.');
