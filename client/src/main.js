// Compile repos template
let reposTemplate = $('#repos-template').html();
let renderRepos = Handlebars.compile(reposTemplate);

// Compile searches template
let searchesTemplate = $('#searches-template').html();
let renderSearches = Handlebars.compile(searchesTemplate);

// Code to save and render all searches
let allSearches;
function renderAllSearches(searches) {
  let searchesHTML = renderSearches({
    searches: searches
  });
  $('#searches-list').empty();
  $('#searches-list').append(searchesHTML);
}

//Initial search history render
$.ajax({
  type: 'GET',
  url: 'http://localhost:3000/api/searches'
}).then(function(searches) {
  allSearches = searches;
  renderAllSearches(allSearches);
});

// Function to save and display search history
function saveSearch(searchTerm) {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/api/searches',
    data: {
      term: searchTerm,
      createdAt: new Date()
    }
  }).then(function(search) {
    allSearches = allSearches.concat([search]);
    renderAllSearches(allSearches);
  })
}

// Function to get repos based on user search
function getRepos(searchTerm) {
  $.ajax({
    type: 'GET',
    url: `https://api.github.com/users/${searchTerm}/repos`
  }).then(function(repos) {
    // If successful, clear previous results and render repos
    let reposHTML = renderRepos({
      repos: repos
    });
    $('#loading').remove();
    $('#repos-list').append(reposHTML);
  }, function() {
    //If unsuccessful, clear previous results and display error
    $('#loading').remove();
    $('#repos-list').append('<p>User not found</p>');
  });
}

$('#search-button').on('click', function() {
  // Get user input
  let searchTerm = $('#search-username').val();

  // Save search history
  saveSearch(searchTerm);

  // Prepare search results area
  $('#repos-list').empty();
  $('#repos-list').append(`<h3>Repos for user ${searchTerm}<h3>`);
  $('#repos-list').append('<p id=loading>Loading...<p>');

  // Get repos from user search
  getRepos(searchTerm);
})
