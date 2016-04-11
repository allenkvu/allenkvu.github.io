
var stack = []; //use to go back previous question

$(".start").click(function() {
  stack.push(treeData);
  $('#resetButton').toggle();
  traverseTree(treeData);
});

$(".backBtn").click(function() {
  if (stack.length > 0)
    traverseTree(stack.pop());
});

$(".resetBtn").click(function() {
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
  
  // get anime info in XML from ANN api
  getAnimeDataANN(labelTitle, function(target) {
    var animeId = $(target).attr("id");
    var animeTitle = $(target).attr("name");
    var plot = $(target).find("info[type='Plot Summary']").text();
    var epCount = $(target).find("info[type='Number of episodes']").text();
    var airDate = $(target).find("info[type='Vintage']").first().text()
    var imageLocation = $(target).find("info[type='Picture']");
    var images = $(imageLocation).find("img");
    var imageSrc;
    images.each(function() { //goes through each of the image, by the end of this each biggestImageSrc will be updated to the last (biggest) image
      imageSrc = $(this).attr("src");
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

    createAnimePanel(animeTitle, plot, epCount, airDate, imageSrc, ep1LinkObj);
  });
}

//creates panel with anime info
var createAnimePanel = function(animeTitle, plot, epCount, airDate, imageSrc, ep1LinkObj) { //needs rating
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
  var panel = "<div class='col-md-4 col-centered col-max col-min form-group'><div class='block'> <p class ='animeTitle text-center' > " + animeTitle + "</p> <img class=' img-responsive center-block' src='" + imageSrc + "'> <p class='miniInfo text-left'>Total Episodes:" + epCount +  "<span style='float:right'>Air date: "  + airDate + " </span></p> <p class='plotSummary'>Plot Summary: </p> <p class='plotText text-left'>" + plot + " </p> "
  ep1Button += "</div> </div></div> "; //closure for panel
  panel += ep1Button; //puts ep1 buttons to panel

  //var panel ="<div class='col-xs-4'> <div class='panel panel-default'><div class='panel-heading'>Panel Heading</div><div class='panel-body'>Panel content</div></div>";

  $(".animeSuggestions").append(panel);

  $(".backBtn").prop("disabled", false); //anime panel loaded, enable back button
}

var getAnimeDataANN = function(animeTitle, callback) { // get anime info in xml from ANN
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
          var animeInfo = $xml.find('anime[name="' + animeTitle + '"]', 'anime[precision="TV"]'); //find corresponding TV series anime 
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