// Optimise the team's own destination images into the app. Each country gets an
// ordered set (realistic shots first, playful ones after) that the dashboard
// hero cycles through as a carousel. Sources are the team's images in SRC_DIR;
// output is width-capped mozjpeg into src/assets/cities/<code>/<n>.jpg.
// Run: node scripts/build-cities.mjs
import sharp from 'sharp'
import { rmSync, mkdirSync, existsSync } from 'node:fs'

const SRC_DIR = 'D:/PANDA PICS'
const OUT = 'src/assets/cities'
const WIDTH = 1400
const QUALITY = 82

// Playful image first (the Liberty Compass vibe), then the realistic photos.
// US leads with the neutral "eagle diner" rather than the Trump image (kept last).
const MAP = {
  us: ['eagle_s_feast_at_the_americana_diner.png', 'usa_hotdog_statue_of_liberty.jpg', 'usa.jpg', 'usa_panda_with_donald_trump.jpg'],
  br: ['capybara_carnival_skater_on_beachfront_promenade.png', 'brazil_rio_copacabana.jpg', 'rio_de_janeiro_brazil.jpg'],
  de: ['techno_dachshund_at_brandenburg_gate.png', 'germany_berlin_currywurst.jpg', 'berlin_germany.jpg'],
  no: ['celebratory_moment_with_moose_and_football.png', 'norway_haaland_fjord.jpg', 'norway.jpg'],
  ke: ['safari_tour_led_by_a_lion.png', 'kenya_safari.jpg', 'kenya.jpg'],
  eg: ['regal_cat_pharaoh_and_selfie_camel.png', 'egypt_giza_pyramids.jpg', 'giza_egypt.jpg'],
  za: ['lifeguard_penguin_briefing_at_the_beach.png', 'south_africa_penguins.jpg', 'south_africa.jpg'],
  cn: ['red_panda_on_scooter_atop_great_wall.png', 'china_great_wall_walking.jpg', 'china_great_wall_bamboo_beer.jpg', 'china.jpg'],
  au: ['cool_koala_catches_the_wave.png', 'australia_kangaroo.jpg', 'australia.jpg'],
  uz: ['camel_playing_chess_in_bukhara.png', 'uzbekistan_bukhara.jpg', 'bukhara_uzbekistan.jpg'],
}

// Guard: never wipe the bundled images if the (removable) source drive is gone.
if (!existsSync(SRC_DIR)) {
  console.error(`Source ${SRC_DIR} not found — aborting so the bundled images in ${OUT} are not wiped.`)
  process.exit(1)
}

if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

let total = 0
for (const [code, files] of Object.entries(MAP)) {
  mkdirSync(`${OUT}/${code}`, { recursive: true })
  let n = 0
  for (const f of files) {
    const src = `${SRC_DIR}/${f}`
    if (!existsSync(src)) {
      console.log(`  ! missing ${f}`)
      continue
    }
    n++
    const out = `${OUT}/${code}/${n}.jpg`
    const info = await sharp(src)
      .resize({ width: WIDTH, withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(out)
    total++
    console.log(`  ${code}/${n}.jpg  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB  <- ${f}`)
  }
}
console.log(`\ndone: ${total} images across ${Object.keys(MAP).length} countries`)
