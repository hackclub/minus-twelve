async function get_json(url) {
  const response = await fetch(url, { cache: 'no-cache' });
  let json;
  if (response.ok) {
    json = await response.json();
  }
  return json;
}

function append_submission(submission) {
  console.log(submission);
  let e_section = document.createElement('div');
  e_section.classList.add('section');
  let e_name = document.createElement('h2');
  e_name.innerHTML = submission.name;
  let e_links = document.createElement('p');
  e_links.innerHTML = `<a href="${submission.repo_link}" target="_blank">Repository</a> &middot; <a href="${submission.package_link}" target="_blank">Package</a>`
  let e_description = document.createElement('blockquote');
  e_description.innerHTML = submission.description;
  e_section.appendChild(e_name);
  e_section.appendChild(e_links);
  e_section.appendChild(e_description);
  document.getElementById('main').appendChild(e_section);
}

get_json('./submissions.json').then(json => {
  const submissions = json.submissions;
  document.getElementById('n_submissions').innerHTML = `${submissions.length} submissions`;
  for (let i = 0; i < submissions.length; i++) {
    append_submission(submissions[i]);
  }
})