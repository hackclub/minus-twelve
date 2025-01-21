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
  e_name.setAttribute('id', submission.name);
  let e_permalink = document.createElement('p');
  e_permalink.classList.add('permalink');
  e_permalink.innerHTML = `<a href="#${submission.name}">#</a>`;
  let e_links = document.createElement('p');
  e_links.innerHTML = `<a href="${submission.repo_link}" target="_blank">Repository</a> &middot; <a href="${submission.package_link}" target="_blank">Package</a>`;
  let e_screenshot = document.createElement('img');
  e_screenshot.src = submission.screenshot;
  let e_author = document.createElement('p');
  e_author.innerHTML = `<b>${submission.author}</b> had this to say about <i>${submission.name}</i>:`
  let e_description = document.createElement('blockquote');
  e_description.innerHTML = submission.description;
  e_section.appendChild(e_permalink);
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
  document.getElementById('n_submissions_2').innerHTML = `${submissions.length} submissions`;
  for (let i = 0; i < submissions.length; i++) {
    append_submission(submissions[i]);
  }
  // move to hash if present
  if (window.location.hash !== '') {
    const e = document.getElementById(window.location.hash.slice(1));
    if (e === null) {
      return;
    }
    const y = e.getBoundingClientRect().top;
    scroll({ top: y, behavior: 'instant' });
  }
});

document.getElementById('search').oninput = function() {
  const sections = Array.from(document.querySelectorAll('.section'));
  document.getElementById('n_submissions_2').innerHTML = `${sections.length} submissions`;
  for (const section of sections) {
    section.classList.remove('hidden');
  }
  let v = document.getElementById('search').value;
  if (v === '') {
    return;
  }
  const hidden = sections.filter(section => {
    const [e_name, e_links, e_screenshot, e_author, e_description] = Array.from(section.childNodes);
    const name = e_name.innerHTML;
    const author = e_author.childNodes[0].innerHTML;
    const description = e_description.innerHTML;
    if (name.includes(v) || author.includes(v) || description.includes(v)) {
      return false;
    }
    return true;
  });
  const n = sections.length - hidden.length;
  document.getElementById('n_submissions_2').innerHTML = `${n} submissions`;
  for (const section of hidden) {
    section.classList.add('hidden');
  }
}