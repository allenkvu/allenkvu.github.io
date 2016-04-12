
var stack = []; //use to go back previous question
var regiion;

$(document).ready(function() {
	stack.push(treeData);
	traverseTree(treeData);
});


$(".backBtn").click(function() {
  if (stack.length > 2)
    traverseTree(stack.pop());
  else if(stack.length == 2){//clicking back at this point is same thing as resetting
	reset();
  }
});

$(".resetBtn").click(function() {
  reset();
});

var reset = function(){
	stack.splice(0,stack.length)
	stack.push(treeData);
	$('#resetButton').toggle();
	traverseTree(treeData);
}
var traverseTree = function(treeNode) {
	console.log(stack.length);
 if(stack.length == 2 && $('#resetButton').is(':hidden')){// 2 = user clicked start
	 $('#resetButton').toggle();
 }
  $("#data .title").text(treeNode.question);
  
  if(treeNode.sub != null)
	$("#data .sub").text(treeNode.sub);
  else
	$("#data .sub").text("");

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

  $("#data .title").text("You should watch");

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
    var airYear = $(target).find("info[type='Vintage']").first().text().slice(0,4);
    var imageLocation = $(target).find("info[type='Picture']");
    var images = $(imageLocation).find("img");
    var imageSrc;
    images.each(function() { //goes through each of the image, by the end of this each biggestImageSrc will be updated to the last (biggest) image
      imageSrc = $(this).attr("src");
    });

    plot += "<br><a href='http://www.animenewsnetwork.com/encyclopedia/anime.php?id=" + animeId + "'  target='_blank'><font size='2'>(source:  Anime News Network)</font></a>"; //add source+link

    var ep1LinkObj = null;
    var customDataArr = animeCustomDatas[animeTitle];

    //assign custom info if needed
    if (customDataArr != null) {
      if (customPlotNeeded && customDataArr.customPlot != null) {
        plot = customDataArr.customPlot;
      }
      if (Object.keys(customDataArr.episodeLink).length != 0) {
        ep1LinkObj = customDataArr.episodeLink; //obj containing "site name : ep1 links"
      }
      if (customDataArr.customImage != null) {
        imageSrc = customDataArr.customImage;
      }
    }

    createAnimePanel(animeTitle, plot, epCount, airYear, imageSrc, ep1LinkObj);
  });
}

//creates panel with anime info
var createAnimePanel = function(animeTitle, plot, epCount, airYear, imageSrc, ep1LinkObj) { //needs rating
  var ep1Button = "";
  var siteColor;
  
  if (ep1LinkObj != null) {
    ep1Button += "<div class ='ep1Text text-center' >Watch it on <br>";

    $.each(ep1LinkObj, function(siteName, link) {
	  var supportedStreamSites = true; //Supported: Crunchyroll, Hulu, Funimation, need Youtube, daisuki
	  
      switch (siteName) {
        case "crunchyroll":
          siteColor = "buttonCrunchy";
          break;
        case "hulu":
          siteColor = "buttonHulu";
          break;
		case "netflix":
          siteColor = "buttonNetflix";
          break;
		case "funimation":
          siteColor = "buttonFunimation";
          break;
        default:
          supportedStreamSites = false;
      }
	  if(supportedStreamSites)
		ep1Button += "<a href=" + link + "  target='_blank' class='button  buttonEpLink " + siteColor + "' role='button'>" + siteName.toUpperCase() + " </a>"

	});

    ep1Button += "</div>" //close .ep1Text
  }

  //.imagePanel {height:400px;position:relative;display:block;overflow:hidden;}
  var panel = "<div class='col-md-4 col-centered col-max col-min form-group'><div class='block'> <p class ='animeTitle text-center' > " + animeTitle + "</p> <img class=' img-responsive center-block' src='" + imageSrc + "'> <p class='miniInfo text-left'>Total Episodes:" + epCount +  "<span style='float:right'>Year aired on: "  + airYear + " </span></p> <p class='plotSummary'>Plot Summary: </p> <p class='plotText text-left'>" + plot + " </p> "
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