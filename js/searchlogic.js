const input = document.getElementById('searchText');

document.getElementById('searchForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const query = config.searchproviders[0].searchPrefix + input.value;

    console.log(query);

    window.location.href = query;
})