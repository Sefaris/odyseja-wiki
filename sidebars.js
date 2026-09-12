const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');

function chapterSidebar(number) {
  const id = `sekcje/zadania/rozdzial_${number}`;
  const sources = ['md', 'mdx'].map(extension => path.join(__dirname, 'docs', `${id}.${extension}`)).filter(fs.existsSync);
  if (sources.length !== 1) throw new Error(`Oczekiwano jednego pliku rozdziału: ${id}`);
  const {data, content} = matter(fs.readFileSync(sources[0], 'utf8'));
  const items = [];
  let fence;

  // Menu follows the document's locations and task groups, without listing every quest.
  for (const line of content.split(/\r?\n/)) {
    const codeFence = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (codeFence) {
      if (!fence) fence = codeFence[1];
      else if (codeFence[1][0] === fence[0] && codeFence[1].length >= fence.length) fence = undefined;
      continue;
    }
    if (fence || !/^#{2,3} /.test(line)) continue;
    const heading = line.match(/^(#{2,3}) (.+?)\s+\{#([^}]+)\}\s*$/);
    if (!heading) throw new Error(`Nagłówek menu wymaga jawnego {#id} w ${id}: ${line}`);
    items.push({
      type: 'link',
      label: heading[2],
      href: `${data.slug}#${heading[3]}`,
      className: heading[1].length === 2 ? 'menu-location' : 'menu-task-group',
      customProps: {chapterSection: true},
    });
  }

  return {
    type: 'category',
    label: data.title,
    className: 'menu-chapter',
    link: {type: 'doc', id},
    collapsible: true,
    collapsed: true,
    items,
  };
}

module.exports = {
  wiki: [
    {type: 'doc', id: 'README', label: 'Strona główna', className: 'menu-home'},
    {
      type: 'category', label: 'Solucja', collapsible: false,
      items: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'].map(chapterSidebar),
    },
    {
      type: 'category', label: 'Informacje dodatkowe', collapsible: false,
      items: [{type: 'doc', id: 'sekcje/informacje-dodatkowe/teleporty', label: 'Lista teleportów'}],
    },
  ],
};
