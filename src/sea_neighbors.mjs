import {createRetryHints} from './retry_hints.mjs';
import {createSpeech} from './balloon_speech.mjs';
import {readProfiles,saveProfiles,dateLabel} from './balloon_profiles.mjs';
import {species, letters, sequence} from './sea_neighbors_core.mjs';
const retryHints=createRetryHints(),board=document.querySelector('#activity-board'),feedback=document.querySelector('#feedback'),celebration=document.querySelector('#celebration');
const speech=createSpeech(window.speechSynthesis,window.SpeechSynthesisUtterance,()=>document.querySelector('#speech-status').textContent='当前语音不可用，请看文字提示。');
function stopCelebration(){celebration.hidden=true;}
function stop(){speech.stop();stopCelebration();}
window.addEventListener('pagehide',stop);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
window.addEventListener('beforeprint',stop);
document.querySelector('#speak').onclick=()=>speech.speak(document.querySelector('.instructions p').textContent);
let profileStorage;
try {
  profileStorage = window.localStorage;
} catch {
  profileStorage = null;
}
let profiles = readProfiles(profileStorage);
function showProfile() {
  const select = document.querySelector("#student");
  select.replaceChildren(
    new Option("选择学生", ""),
    ...profiles.names.map((name) => new Option(name, name)),
  );
  select.value = profiles.active;
  document.querySelector("#student-label").textContent =
    `${profiles.active || "未选择学生"} ${dateLabel()}`;
}
function persistProfile() {
  const saved = saveProfiles(profileStorage, profiles);
  document.querySelector("#profile-status").textContent = saved
    ? ""
    : "当前浏览器无法保存档案，本次仍可练习。";
  showProfile();
}
document.querySelector("#student").addEventListener("change", (event) => {
  profiles.active = event.target.value;
  persistProfile();
});
document.querySelector("#profile-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#student-name");
  const name = input.value.trim();
  if (!name) {
    input.focus();
    return;
  }
  if (!profiles.names.includes(name)) {
    if (profiles.names.length >= 50) {
      document.querySelector("#profile-status").textContent =
        "本机最多保存 50 个学生档案。";
      return;
    }
    profiles.names.push(name);
  }
  profiles.active = name;
  input.value = "";
  persistProfile();
});
showProfile();
setInterval(showProfile, 60000);

const fields = [];
for (const {id, name, exercises} of species) {
  const row = document.createElement('section');
  row.className = 'creature-row';
  row.dataset.species = id;
  const heading = document.createElement('h2');
  heading.textContent = name;
  const groups = document.createElement('div');
  groups.className = 'creature-groups';
  for (const exercise of exercises) {
    const group = document.createElement('div');
    group.className = 'creature-group';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', `第 ${groups.children.length + 1} 组`);
    sequence(exercise.start).forEach((letter, position) => {
      const creature = document.createElement('div');
      creature.className = 'creature';
      const image = new Image();
      image.src = `assets/neighbors_${id}.png`;
      image.alt = '';
      const belly = document.createElement('div');
      belly.className = 'creature-belly';
      const label = document.createElement('strong');
      label.className = 'belly-label';
      creature.append(image, belly);
      belly.append(label);
      if (exercise.blanks.includes(position)) {
        const field = document.createElement('select');
        field.className = 'creature-letter';
        field.setAttribute('aria-label', `${name}第 ${groups.children.length + 1} 组，第 ${position + 1} 个音名`);
        field.append(new Option('—', ''), ...[...letters].map(note => new Option(note, note)));
        fields.push({field, letter, label});
        belly.append(field);
        label.setAttribute('aria-hidden', 'true');
      } else {
        label.classList.add('creature-letter');
        label.textContent = letter;
      }
      group.append(creature);
    });
    groups.append(group);
  }
  row.append(heading, groups);
  board.append(row);
}

function updateCount() {
  for (const {field, label} of fields) {
    label.textContent = field.value || '—';
    label.classList.toggle('answered', Boolean(field.value));
  }
  document.querySelector('#count').textContent = fields.filter(({field}) => field.value).length;
}

board.addEventListener('change', () => {
  stop();
  retryHints.clear();
  updateCount();
  feedback.textContent = '';
});
document.querySelector('#check').onclick = () => {
  stop();
  let blank = 0;
  let errors = 0;
  fields.forEach(({field, letter}, index) => {
    const wrong = field.value ? field.value !== letter : null;
    if (wrong === null) blank++;
    if (wrong) errors++;
    retryHints.check(index, wrong, field, letter);
  });
  const messages = [];
  if (blank) messages.push(`还有 ${blank} 个音名没有填。`);
  if (errors) messages.push(`有 ${errors} 个音名需要再想一想。`);
  if (!messages.length) {
    messages.push('全部答对啦！你真棒！');
    celebration.hidden = false;
  }
  feedback.textContent = messages.join('');
};
document.querySelector('#next').onclick = () => {
  stop();
  retryHints.reset();
  fields.forEach(({field}) => { field.value = ''; });
  updateCount();
  feedback.textContent = '';
};
document.querySelector('#print').onclick = () => { stop(); window.print(); };
document.querySelector('#close-celebration').onclick = stopCelebration;
celebration.addEventListener('animationend', event => {
  if (event.animationName === 'parade') stopCelebration();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') stopCelebration();
});
