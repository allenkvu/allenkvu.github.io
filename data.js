var animeCustomDatas = {
  "Slam Dunk": {
    "customPlot": null,
    "customImage": "http://cdn.myanimelist.net/images/anime/11/20861l.jpg",
    "ep1Links": {
      "Crunchyroll": "http://www.crunchyroll.com/slam-dunk/episode-1-birth-of-a-basketball-genius-475066",
      "Hulu": "http://www.hulu.com/watch/823318"
    }
  },
  "School-Live!": {
    "customPlot": "Watch episode 1 then decide",
    "customImage": "http://cdn.myanimelist.net/images/anime/4/75069l.jpg",
    "ep1Links": {
      "Crunchyroll": "http://www.crunchyroll.com/school-live/episode-1-beginning-682347"
    }
  },
  "Puella Magi Madoka Magica": {
    "customPlot": "Watch till episode 3 then decide",
    "customImage": "http://cdn.myanimelist.net/images/anime/11/55225l.jpg",
    "ep1Links": {
      "Crunchyroll": "http://www.crunchyroll.com/puella-magi-madoka-magica/episode-1-i-first-met-her-in-a-dream-or-something-591735"
    }
  }
};

var treeData = {
  "3": "test",
  "id": 0,
  "label": "Root",
  "question": "What Genre?",
  "children": [{
    "id": 0,
    "label": "Action",
    "question": "What kind of action?",
    "children": [{
      "id": 0,
      "label": "Robot",
      "question": null,
      "children": [{
        "id": 0,
        "label": "Mobile Suit Gundam 00",
        "question": null,
        "children": null
      }, {
        "id": 1,
        "label": "Gurren Lagann",
        "question": null,
        "children": null
      }]
    }, {
      "id": 1,
      "label": "Sports",
      "question": null,
      "children": [{
        "id": 0,
        "label": "Slam Dunk",
        "question": null,
        "children": null
      }, {
        "id": 1,
        "label": "Fighting Spirit",
        "question": null,
        "children": null
      }]
    }]
  }, {
    "id": 1,
    "label": "Comedy",
    "question": "What kind of comedy?",
    "children": [{
      "id": 0,
      "label": "Romance comedy",
      "question": null,
      "children": [{
        "id": 0,
        "label": "Monthly Girls' Nozaki-kun",
        "question": null,
        "children": null
      }, {
        "id": 1,
        "label": "Toradora!",
        "question": null,
        "children": null
      }]
    }, {
      "id": 1,
      "label": "Daily Life",
      "question": null,
      "children": [{
        "id": 0,
        "label": "Daily Lives of High School Boys",
        "question": null,
        "children": null
      }, {
        "id": 1,
        "label": "Nichijou - My Ordinary Life",
        "question": null,
        "children": null
      }]
    }]
  }, {
    "id": 2,
    "label": "Thriller",
    "question": "What kind of Thriller?",
    "children": [{
      "id": 0,
      "label": "Mystery",
      "question": null,
      "children": [{
        "id": 0,
        "label": "Death Note",
        "question": null,
        "children": null
      }, {
        "id": 1,
        "label": "Future Diary",
        "question": null,
        "children": null
      }]
    }, {
      "id": 1,
      "label": "Daily Life",
      "question": null,
      "children": [{
        "id": 0,
        "label": "Daily Lives of High School Boys",
        "question": null,
        "children": null
      }, {
        "id": 1,
        "label": "Nichijou - My Ordinary Life",
        "question": null,
        "children": null
      }]
    }]
  }, {
    "id": 0,
    "label": "Like to go in blind?",
    "question": "Have a lot of time?",
    "children": [{
      "id": 0,
      "label": "Yes",
      "question": null,
      "children": [{
        "id": 0,
        "label": "Puella Magi Madoka Magica",
        "customPlotNeeded": true,
        "question": null,
        "children": null
      }]
    }, {
      "id": 1,
      "label": "No",
      "question": null,
      "children": [{
        "id": 0,
        "label": "School-Live!",
        "customPlotNeeded": true,
        "question": null,
        "children": null
      }]
    }]
  }]
}