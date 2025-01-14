async function get_json(url) {
  const response = await fetch(url, { cache: 'no-cache' });
  let json;
  if (response.ok) {
    json = await response.json();
  }
  return json;
}

/**
 * Append a submission to the gallery.
 * @param {object} submission
 * @param {string} submission.name
 * @param {string} submission.author
 * @param {string} submission.description
 * @param {string} submission.repo_link
 * @param {string} submission.package_link
 * @param {string} submission.screenshot
 */
function append_submission(submission) {
  console.log(submission);
  let e_section = document.createElement('div');
  e_section.classList.add('section');
  let e_name = document.createElement('h2');
  e_name.innerHTML = submission.name;
  let e_links = document.createElement('p');
  e_links.innerHTML = `<a href="${submission.repo_link}" target="_blank">Repository</a> &middot; <a href="${submission.package_link}" target="_blank">Package</a>`;
  let e_screenshot = document.createElement('img');
  e_screenshot.src = submission.screenshot;
  let e_author = document.createElement('p');
  e_author.innerHTML = `<b>${submission.author}</b> had this to say about <i>${submission.name}</i>:`
  let e_description = document.createElement('blockquote');
  e_description.innerHTML = submission.description;
  e_section.appendChild(e_name);
  e_section.appendChild(e_links);
  e_section.appendChild(e_screenshot);
  e_section.appendChild(e_author);
  e_section.appendChild(e_description);
  document.getElementById('gallery_container').appendChild(e_section);
}

get_json('./submissions.json').then(json => {
  const submissions = json.submissions;
  document.getElementById('n_submissions').innerHTML = `${submissions.length} submissions`;
  for (let i = 0; i < submissions.length; i++) {
    append_submission(submissions[i]);
  }
})