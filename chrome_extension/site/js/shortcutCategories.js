import { config } from "./config.js";

export function displayCategories() {
    document.querySelector('.shortcut-category-container').style.display = '';
    document.querySelector('.shortcut-category-close').style.display = '';
    let generatedCategories = [];
    config.shortCuts.forEach(shortCut => {
        let sc = shortCut;
        console.log(sc.category);
        if (!sc.category) {
            sc.category = 'Standard';
        }

        console.log(sc.category);

        if (!generatedCategories.includes(sc.category)) {
            console.log('test');
            generateCategorie(sc.category);
            generatedCategories.push(sc.category);
        }

        generateLink(sc.category, sc.name, sc.url);
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