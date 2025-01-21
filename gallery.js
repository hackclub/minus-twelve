const HIGH_PRIORITY_TAGS = ['javascript', 'typescript', 'cli'];

let submissions = [];
let tags = [];

function unique(v, i, r) {
  return r.indexOf(v) === i;
}

function partition(r, cb) {
  let a = [];
  let b = [];
  r.forEach((v, i, r2) => (cb(v, i, r2) ? a : b).push(v));
  return [a, b];
}

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
 * @param {string[]} submission.tags
 * @param {string[]} submission.hidden_tags
 */
function append_submission(submission) {
  let e_section = document.createElement('div');
  e_section.classList.add('section');
  // name
  let e_permalink = document.createElement('p');
  e_permalink.classList.add('permalink');
  e_permalink.innerHTML = `<a href="#${submission.name}">#</a>`;
  let e_name = document.createElement('h2');
  e_name.innerHTML = submission.name;
  e_name.setAttribute('id', submission.name);
  // tags
  let e_tags = document.createElement('div');
  for (const tag of sort_tags(submission.tags)) {
    let e_tag = document.createElement('p');
    e_tag.classList.add('tag');
    e_tag.innerHTML = tag;
    e_tags.appendChild(e_tag);
  }
  // links
  let e_links = document.createElement('p');
  e_links.innerHTML = `<a href="${submission.repo_link}" target="_blank">Repository</a> &middot; <a href="${submission.package_link}" target="_blank">Package</a>`;
  // screenshot
  let e_screenshot = document.createElement('img');
  e_screenshot.src = submission.screenshot;
  // author
  let e_author = document.createElement('p');
  e_author.innerHTML = `<b>${submission.author}</b> had this to say about <i>${submission.name}</i>:`
  // description
  let e_description = document.createElement('blockquote');
  e_description.innerHTML = submission.description;
  // append all children
  e_section.appendChild(e_permalink);
  e_section.appendChild(e_name);
  e_section.appendChild(e_tags);
  e_section.appendChild(e_links);
  e_section.appendChild(e_screenshot);
  e_section.appendChild(e_author);
  e_section.appendChild(e_description);
  document.getElementById('gallery_container').appendChild(e_section);
}

/**
 * Append a tag to the top of the gallery.
 * @param {string} tag
 */
function append_tag(tag) {
  let e_tag = document.createElement('p');
  e_tag.classList.add('tag');
  e_tag.setAttribute('onpointerdown', `toggle_tag('${tag}')`);
  e_tag.innerHTML = tag;
  document.getElementById('tags').appendChild(e_tag);
}

/**
 * Toggle a specific tag.
 * @param {string} tag
 */
function toggle_tag(tag) {
  let e_tag = Array.from(document.getElementById('tags').childNodes).find(e => e.innerHTML === tag);
  const class_list = Array.from(e_tag.classList);
  if (class_list.includes('tag-active')) {
    e_tag.classList.remove('tag-active');
  } else {
    e_tag.classList.add('tag-active');
  }
  filter_submissions();
}

function filter_submissions() {
  let sections = Array.from(document.querySelectorAll('.section'));
  document.getElementById('n_submissions_2').innerHTML = `${sections.length} submissions`;
  for (const section of sections) {
    section.classList.add('hidden');
  }
  let v = document.getElementById('search').value.toLowerCase();
  // filter by selected tags
  // console.log('filtering by selected tags');
  sections = sections.filter(section => {
    const name = section.childNodes[1].innerHTML.toLowerCase();
    const e_tags = Array.from(section.childNodes)[2];
    const activated_tags = Array.from(document.querySelectorAll('.tag-active')).map(e => e.innerHTML);
    const submission_tags = Array.from(e_tags.childNodes).map(node => node.innerHTML);
    if (activated_tags.every(tag => submission_tags.includes(tag))) {
      // console.log(`${name} will be kept (all tags match)`);
      return true;
    }
    return false;
  });
  // filter by search
  if (v !== '') {
    // console.log(`filtering by results of search for "${v}"`);
    sections = sections.filter(section => {
      // console.log('json:', json);
      const [e_permalink, e_name, e_tags, e_links, e_screenshot, e_author, e_description] = Array.from(section.childNodes);
      const name = e_name.innerHTML.toLowerCase();
      const json = submissions.find(submission => submission.name.toLowerCase() === name);
      const tags = json.tags;
      const hidden_tags = json.hidden_tags;
      const author = e_author.childNodes[0].innerHTML.toLowerCase();
      const description = e_description.innerHTML.toLowerCase();
      // if (name.includes(v)) {
      //   console.log(`${name} will be kept (search matches name)`);
      // }
      // if (tags.some(tag => tag === v)) {
      //   console.log(`${name} will be kept (search matches a tag)`);
      // }
      // if (hidden_tags.some(tag => tag === v)) {
      //   console.log(`${name} will be kept (search matches a hidden tag)`);
      // }
      // if (author.includes(v)) {
      //   console.log(`${name} will be kept (search matches author)`);
      // }
      // if (description.includes(v)) {
      //   console.log(`${name} will be kept (search matches description)`);
      // }
      if (name.includes(v) || tags.some(tag => tag === v) || hidden_tags.some(tag => tag === v) || author.includes(v) || description.includes(v)) {
        return true;
      }
      return false;
    });
  }
  const n = sections.length;
  // console.log(`matching submissions: ${n}`);
  document.getElementById('n_submissions_2').innerHTML = `${n} of ${submissions.length} submissions`;
  for (const section of sections) {
    section.classList.remove('hidden');
  }
}

/**
 * Sort a list of tags.
 * @param {string[]} unsorted
 * @returns {string[]}
 */
function sort_tags(unsorted) {
  // partition the tags into high priority and low priority
  let [high_priority, low_priority] = partition(unsorted, v => HIGH_PRIORITY_TAGS.includes(v));
  // maintain the desired order of high priority tags by filtering the constant instead of the partition
  high_priority = HIGH_PRIORITY_TAGS.filter(tag => high_priority.includes(tag));
  // sort the low priority tags alphabetically
  low_priority.sort();
  return [...high_priority, ...low_priority];
}

get_json('./submissions.json').then(json => {
  submissions = json.submissions;
  tags = sort_tags(submissions.flatMap(submission => submission.tags).filter(unique));
  // document.getElementById('n_submissions').innerHTML = `${submissions.length} submissions`;
  document.getElementById('n_submissions_2').innerHTML = `${submissions.length} of ${submissions.length} submissions`;
  for (let i = 0; i < submissions.length; i++) {
    append_submission(submissions[i]);
  }
  for (let i = 0; i < tags.length; i++) {
    append_tag(tags[i]);
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

document.getElementById('search').oninput = filter_submissions;