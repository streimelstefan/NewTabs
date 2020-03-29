import { config } from "./config.js";

export function displayCategories() {
    document.querySelector('.shortcut-category-container').style.display = '';
    document.querySelector('.shortcut-category-close').style.display = '';
    let categories = [];
    config.shortCuts.forEach(shortCut => {
        let sc = shortCut;
        if (!sc.category) {
            sc.category = 'Standard';
        }

        let found = false;
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].name === sc.category) {
                found = true;
            }
        }

        if (!found) {
            console.log('test');
            categories.push({name: sc.category, sc: []});
        }

        for (let i = 0; i < categories.length; i++) {
            if (categories[i].name === shortCut.category) {
                categories[i].sc.push(shortCut);
            }
        }
    });

    categories.sort((a, b) => {
        return b.sc.length - a.sc.length;
    });

    categories.forEach(category => {
        generateCategorie(category.name);
        category.sc.forEach(sc => {
            generateLink(sc.category, sc.name, sc.url);
        });
    }); 

}

export function removeCategories() {
    document.querySelector('.shortcut-category-container').style.display = 'none';
    document.querySelector('.shortcut-category-close').style.display = 'none';
    document.querySelector('.shortcut-category-container').innerHTML = '';
}

function generateCategorie(name) {
    const category = document.createElement('div');

    category.classList.add('category');

    const title = document.createElement('h1');
    
    title.innerText = name;

    const list = document.createElement('ul');

    list.id = 'category.ul.' + name;

    category.appendChild(title);
    category.appendChild(list);

    document.querySelector('.shortcut-category-container').appendChild(category);
}

function generateLink(categoryname, linkname, linkdest) {
    const list = document.getElementById(`category.ul.${categoryname}`);

    const listItem = document.createElement('li');
    const link = document.createElement('a');

    link.href = linkdest;
    link.innerText = linkname;

    listItem.appendChild(link);
    list.appendChild(listItem);
}