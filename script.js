const e_huddle = document.getElementById("huddle");

function huddle(iteration) {
  return {
    start_time_us_eu: huddle_start("us_eu", iteration),
    start_time_apac: huddle_start("apac", iteration),
    end_time_us_eu: huddle_end("us_eu", iteration),
    end_time_apac: huddle_end("apac", iteration),
  };
}

function huddle_start(region, iteration) {
  let region_offset = region == "us_eu" ? 2 * 3_600_000 : 12 * 3_600_000;
  return new Date(
    event_start_time.getTime() +
    (86_400_000 * iteration) +
    region_offset
  );
}

function huddle_end(region, iteration) {
  return new Date(
    huddle_start(region, iteration).getTime() +
    3_600_000
  );
}

function huddle_check() {
  let now = new Date();
  let closest_huddle_us_eu = huddles.find(v => now.getTime() <= v.start_time_us_eu.getTime());
  let closest_huddle_apac = huddles.find(v => now.getTime() <= v.start_time_apac.getTime());
  let active_huddle_us_eu = huddles.find(v => now.getTime() > v.start_time_us_eu.getTime() && now.getTime() <= v.end_time_us_eu.getTime());
  let active_huddle_apac = huddles.find(v => now.getTime() > v.start_time_apac.getTime() && now.getTime() <= v.end_time_apac.getTime());
  let time_until_us_eu_huddle = closest_huddle_us_eu.start_time_us_eu.getTime() - now.getTime();
  let time_until_apac_huddle = closest_huddle_apac.start_time_apac.getTime() - now.getTime();
  // consolidate
  let is_huddle_active = active_huddle_us_eu || active_huddle_apac;
  let date_of_huddle = time_until_us_eu_huddle < time_until_apac_huddle
    ? closest_huddle_us_eu.start_time_us_eu
    : closest_huddle_apac.start_time_apac;
  let time_until_huddle = time_until_us_eu_huddle < time_until_apac_huddle
    ? time_until_us_eu_huddle
    : time_until_apac_huddle;
  if (is_huddle_active) {
    e_huddle.innerHTML = `<a href="https://hackclub.slack.com/archives/C087S82MNFR" target="_blank">A huddle is happening!</a>`;
  } else {
    let h = Math.floor(time_until_huddle / 3_600_000);
    let m = Math.floor((time_until_huddle - (h * 3_600_000)) / 60_000);
    // let s = Math.floor((time_until_huddle - (h * 3_600_000) - (m * 60_000)) / 1000);
    let time_text = h > 0 ? `${h + 1} hours`
      : m > 0 ? `${m + 1} minutes`
      : 'less than 1 minute';
    let time_text_long_half = date_of_huddle.getHours() < 12 ? 'AM' : 'PM';
    let time_text_long_hours = date_of_huddle.getHours() == 0 || date_of_huddle.getHours() == 12 ? '12'
      : date_of_huddle.getHours() < 12 ? `${date_of_huddle.getHours()}`
      : `${date_of_huddle.getHours() - 12}`;
    let time_text_long_minutes = date_of_huddle.getMinutes() < 10
      ? `0${date_of_huddle.getMinutes()}`
      : `${date_of_huddle.getMinutes()}`;
    let time_text_long = `January ${date_of_huddle.getDate()}, 2025, ${time_text_long_hours}:${time_text_long_minutes}${time_text_long_half}`;
    e_huddle.innerHTML = `Next huddle <span class="tooltip" title="${time_text_long}" tabindex="0">in ${time_text}</span>!`;
  }
}

let event_start_time = new Date(Date.UTC(2025, 0, 15, 15, 0, 0, 0));
let huddles = Array(13).fill(0).map((x, i) => i).map(x => huddle(x));

huddle_check();
setInterval(huddle_check, 10000);
