const sharp = require('../server/node_modules/sharp');
const path = require('path');
const fs = require('fs');

const inputImg = path.join(__dirname, '../client/public/images/media_1789495746561.jpg');
const outDir = path.join(__dirname, '../client/public/images/assets');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function extract() {
  const meta = await sharp(inputImg).metadata();
  console.log('Source Image:', meta.width, 'x', meta.height);

  const crops = [
    {
      name: 'sarita_bhadauria_hero.jpg',
      region: { left: 5, top: 62, width: 236, height: 212 }
    },
    {
      name: 'modi_portrait.jpg',
      region: { left: 554, top: 62, width: 102, height: 116 }
    },
    {
      name: 'yogi_portrait.jpg',
      region: { left: 549, top: 184, width: 108, height: 103 }
    },
    {
      name: 'etawah_map_badge.jpg',
      region: { left: 462, top: 388, width: 78, height: 140 }
    },
    {
      name: 'qr_code_clean.jpg',
      region: { left: 673, top: 398, width: 78, height: 82 }
    },
    {
      name: 'bottom_leaders_trio.jpg',
      region: { left: 175, top: 840, width: 260, height: 105 }
    },
    {
      name: 'work_rampur_road.jpg',
      region: { left: 16, top: 654, width: 115, height: 72 }
    },
    {
      name: 'work_school_children.jpg',
      region: { left: 140, top: 654, width: 115, height: 72 }
    },
    {
      name: 'work_women_shg.jpg',
      region: { left: 265, top: 654, width: 115, height: 72 }
    },
    {
      name: 'work_health_camp.jpg',
      region: { left: 390, top: 654, width: 115, height: 72 }
    },
    {
      name: 'social_modi.jpg',
      region: { left: 16, top: 439, width: 98, height: 85 }
    },
    {
      name: 'social_yogi.jpg',
      region: { left: 125, top: 439, width: 98, height: 85 }
    },
    {
      name: 'social_bjp.jpg',
      region: { left: 230, top: 439, width: 98, height: 85 }
    },
    {
      name: 'social_rally.jpg',
      region: { left: 335, top: 439, width: 98, height: 85 }
    }
  ];

  for (const c of crops) {
    try {
      await sharp(inputImg)
        .extract(c.region)
        .toFile(path.join(outDir, c.name));
      console.log('Extracted:', c.name);
    } catch (e) {
      console.error('Error on', c.name, e.message);
    }
  }

  console.log('All crops completed.');
}

extract();
