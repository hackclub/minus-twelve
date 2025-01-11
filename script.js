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
  let region_offset = region == "us_eu" ? 3 * 3_600_000 : 13 * 3_600_000;
  return new Date(
    event_start_time.getTime() +
    (2 * 86_400_000 * iteration) +
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
  if (active_huddle_us_eu != undefined) {
    e_huddle.innerHTML = `<a href="https://hackclub.slack.com/archives/C087S82MNFR" target="_blank">A huddle</a> is happening! (US/EU)`;
  } else if (active_huddle_apac != undefined) {
    e_huddle.innerHTML = `<a href="https://hackclub.slack.com/archives/C087S82MNFR" target="_blank">A huddle</a> is happening! (APAC)`;
  }
  else if (time_until_us_eu_huddle <= 7_200_000) {
    let h = Math.floor(time_until_us_eu_huddle / 3_600_000);
    let m = Math.floor(
      (time_until_us_eu_huddle - (h * 3_600_000)) /
      60_000
    );
    let s = Math.floor(
      (time_until_us_eu_huddle - (h * 3_600_000) - (m * 60_000)) /
      1000
    );
    e_huddle.innerHTML = `<a href="https://hackclub.slack.com/archives/C087S82MNFR" target="_blank">A huddle</a> is happening in <b>${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}!</b> (US/EU)`;
  } else if (time_until_apac_huddle <= 7_200_000) {
    let h = Math.floor(time_until_apac_huddle / 3_600_000);
    let m = Math.floor(
      (time_until_apac_huddle - (h * 3_600_000)) /
      60_000
    );
    let s = Math.floor(
      (time_until_apac_huddle - (h * 3_600_000) - (m * 60_000)) /
      1000
    );
    e_huddle.innerHTML = `<a href="https://hackclub.slack.com/archives/C087S82MNFR" target="_blank">A huddle</a> is happening in <b>${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}!</b> (APAC)`;
  } else {
    e_huddle.innerHTML = 'No active huddles.';
  }
}

// let event_start_time = new Date(Date.UTC(2025, 0, ??, ??, 0, 0, 0));
// let huddles = [
//   huddle(1),
//   huddle(2),
//   huddle(3),
//   huddle(4),
//   huddle(5),
//   huddle(6)
// ];

// setInterval(huddle_check, 1000);