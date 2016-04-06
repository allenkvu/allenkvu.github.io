
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

var stack = []; //use to go back previous question
var jsonObj = {
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

$('.start').click(function() {
  stack.push(jsonObj);
  $('#resetButton').toggle();
  traverseTree(jsonObj);
});

$('.backBtn').click(function() {
  if (stack.length > 0)
    traverseTree(stack.pop());
});

$('.resetBtn').click(function() {
  //location.reload();
});

var traverseTree = function(treeNode) {
  $("#data").text(treeNode.question);

  var count = Object.keys(treeNode.children).length;

  $(".animeSuggestions").empty(); //clear previous question buttons

  for (var i = 0; i < count; i++) {
    var obj = treeNode.children[i];

    if (treeNode.question != null) { //there are still nodes down 
      var button = $('<button/>', { //create buttons with question
        class: 'button label',
        text: obj.label,
        id: i,
        value: obj.label,
        click: function() {

          getNode(treeNode, this.value, function(target) {
            stack.push(treeNode);
            traverseTree(target);
          });
        }
      });

      $(".animeSuggestions").append(button);
    } else { // last node, found anime for user

      prepareAnimePanel(obj.label, obj.customPlotNeeded)

    }

  }
}

//search tree to find next node
var getNode = function(container, value, callback) {
  $.each(container.children, function(data) {
    if (container.children[data].label === value) {
      callback(container.children[data]);
    }
    //if (data.children) getNode(data.children, value, callback);
  });
}

var prepareAnimePanel = function(labelTitle, customNeeded) {

  $("#data").text("You should watch");

  $(".backBtn").prop("disabled", true); //disable back button till animePanel loads
  var customPlotNeeded = false;
  if (customNeeded != null) {
    customPlotNeeded = customNeeded;
  }
  
  // get anime info from ANN api
  getAnimeXML(labelTitle, function(target) {
    var animeId = $(target).attr('id');
    var animeTitle = $(target).attr('name');
    var plot = $(target).find('info[type="Plot Summary"]').text();
    var epCount = $(target).find('info[type="Number of episodes"]').text();
    var imageLocation = $(target).find('info[type="Picture"]');
    var images = $(imageLocation).find('img');
    var imageSrc;
    images.each(function() { //goes through each of the image, by the end of this each biggestImageSrc will be updated to the last (biggest) image
      imageSrc = $(this).attr('src');
    });

    plot += "<br><a href='http://www.animenewsnetwork.com/encyclopedia/anime.php?id=" + animeId + "'  target='_blank'><font size='2'>(source:  Anime News Network)</font></a>"; //add source+link

    var ep1LinkObj;
    var customDataArr = animeCustomDatas[animeTitle];

    //assign custom info if needed
    if (customDataArr != null) {
      if (customPlotNeeded && customDataArr.customPlot != null) {
        plot = customDataArr.customPlot;
      }
      if (customDataArr.ep1Links != null) {
        ep1LinkObj = customDataArr.ep1Links; //obj containing "site name : ep1 links"
      }
      if (customDataArr.customImage != null) {
        imageSrc = customDataArr.customImage;
      }
    }

    createAnimePanel(animeTitle, plot, epCount, imageSrc, ep1LinkObj);
  });
}

//creates panel with anime info
var createAnimePanel = function(animeTitle, plot, epCount, imageSrc, ep1LinkObj) { //needs rating
  var ep1Button = "";
  var siteColor;
  console.log(ep1LinkObj);
  if (ep1LinkObj != null) {
    ep1Button += "<div class ='ep1Text text-center' >Watch Episode 1 on: ";

    $.each(ep1LinkObj, function(siteName, link) {

      switch (siteName) {
        case "Crunchyroll":
          siteColor = "buttonCrunchy";
          break;
        case "Hulu":
          siteColor = "buttonHulu";
          break;
        default:
          siteColor = "";
      }
      ep1Button += "<a href=" + link + "  target='_blank' class='button  buttonEpLink " + siteColor + "' role='button'>" + siteName + " </a>"
    });

    ep1Button += "</div>" //close .ep1Text
  }

  //.imagePanel {height:400px;position:relative;display:block;overflow:hidden;}
  var panel = "<div class='col-md-4 col-centered col-max form-group'><div class='block'> <img class=' img-responsive center-block' src='" + imageSrc + "'><p class ='animeTitle text-center' > " + animeTitle + "</p> <p class='plotText text-left'>" + plot + " </p> "

  ep1Button += "</div> </div></div> "; //closure for panel
  panel += ep1Button; //puts ep1 buttons to panel

  //var panel ="<div class='col-xs-4'> <div class='panel panel-default'><div class='panel-heading'>Panel Heading</div><div class='panel-body'>Panel content</div></div>";

  $(".animeSuggestions").append(panel);

  $(".backBtn").prop("disabled", false); //anime panel loaded, enable back button
}

var getAnimeXML = function(animeTitle, callback) { // get xml info of anime from ANN api
  modifiedTitle = encodeURIComponent(animeTitle); // replace spaces to %20
  $.ajax({
    type: "get",
    url: "http://cdn.animenewsnetwork.com/encyclopedia/api.xml?anime=~" + modifiedTitle,
    dataType: "xml",
    success: function(data) {
      /* handle data here */
      //xmlDoc = $.parseXML(data),
      $xml = $(data),
        $xml.find('ann').each(function() {
          var animeInfo = $xml.find('anime[type="TV"]', 'anime[name="' + animeTitle + '"]', 'anime[precision="TV"]'); //find corresponding TV series anime 

          callback(animeInfo);

          //$(this).find("anime").each(function() {
          // var name = $(this).attr('type');
          // if(name == "TV"){
          // console.log(name);
          //   return false;
          // 
          // });

        });

      //$("#type").html(data);
    },
    error: function(xhr, status) {
      /* handle error here */
      //$("#type").html(status);
    }
  });

}