$(document).ready(function() {
  var stack = []; //use to go back previous question
  var region;

  var currentURL = window.location.href ;
  var substring ="#path=0"; //#path=0 is what displays after users press Start (something.com/#path=0)
  var currentPath = currentURL.indexOf(substring);
  var numPattern =  /\d+/g;
  
  stack.push(treeData);
  
  if(currentPath !== -1){  // check if user is loading the web page from the pressed start state
	  var newPath = currentURL.substring(currentPath+6, currentURL.length) // adding 6 to startTree to cut out the '#path='
	  var pathArray = newPath.match(numPattern); //take out '/' and put each number in array
	  console.log(pathArray);
	  var node = findNodeFrmPath(treeData, pathArray);
	  if(node != null)
		traverseTree(node);
  }
  else{
	  traverseTree(treeData);
  }
  

  $(".backBtn").click(function() {
    if (stack.length > 2) {
		
      var strPath = document.location.hash;
      document.location.hash = strPath.substring(0,strPath.length - 2);
      traverseTree(stack.pop());
    } else if (stack.length == 2) { //clicking back at this point is same thing as resetting
      reset();
    }
  });

  $(".resetBtn").click(function() {
    reset();
  });

  function reset() {
    document.location.hash = ""; //reset the url
    stack.splice(0, stack.length)
    stack.push(treeData);

    $('#resetButton').toggle();
    traverseTree(treeData);
  }

  function errorPage(errString){
	$("#data .title").text(errString);
	$("#data .sub").text("");
	if ( $('#resetButton').is(':hidden')) { 
      $('#resetButton').toggle();
	}
  }
  function findNodeFrmPath(node, path){

	var validPath = true;
	for(var i = 0; i < path.length; i++){
		if(node.children[path[i]] != null){
			if(node.question != null) //no need to push if null since the path reached to the end
				stack.push(node);
			node = node.children[path[i]];
	
			
		}
		else{
			validPath = false;
			break;
		}
	  }
	if(validPath)
		return node;
	else
		errorPage("Error - path is invalid");
		


	  
  }
  
  function traverseTree(currentNode) {
	  console.log(document.location.hash);
    if (stack.length >= 2 && $('#resetButton').is(':hidden')) { 
      $('#resetButton').toggle();
    }
	if(currentNode != null && currentNode.label == "Start"){
		document.location.hash = "#path=0";
	}
    $("#data .title").text(currentNode.question);

    if (currentNode.sub != null)
      $("#data .sub").text(currentNode.sub);
    else
      $("#data .sub").text("");

    var count = Object.keys(currentNode.children).length;

    $(".animeSuggestions").empty(); //clear previous question buttons

    for (var i = 0; i < count; i++) {
      var obj = currentNode.children[i];
      if (currentNode.question != null) { //there are still nodes down 
        var button = $('<button/>', { //create buttons with question
          class: 'button label',
          text: obj.label,
          id: i,
          value: obj.label,
          click: function() {
			console.log(obj.label);
            document.location.hash += "/"+this.id //append the path url 
            stack.push(currentNode);
            traverseTree(currentNode.children[this.id]);
          }
        });

        $(".animeSuggestions").append(button);
      } else { // last node, found anime for user
        prepareAnimePanel(obj.label, obj.customPlotNeeded);
      }

    }
  }

  function prepareAnimePanel(labelTitle, customNeeded) {

    $("#data .title").text("You should watch");
    $(".backBtn").prop("disabled", true); //disable back button till animePanel loads

    var customPlotNeeded = false;
    if (customNeeded != null) {
      customPlotNeeded = customNeeded;
    }

    // get anime info in XML from ANN api
    getAnimeDataANN(labelTitle, function(target) {
      var animeTitle;
      var plot;
      var epCount;
      var airYear;
      var imageSrc;

      if (typeof target === "string" || target instanceof String) { //couldnt get ANN info so skip rest
        animeTitle = target;
      } else { //got ANN info 
        var animeId = $(target).attr("id");
        animeTitle = $(target).attr("name");
        plot = $(target).find("info[type='Plot Summary']").text();
        epCount = $(target).find("info[type='Number of episodes']").text();
        airYear = $(target).find("info[type='Vintage']").first().text().slice(0, 4);
        var imageLocation = $(target).find("info[type='Picture']");
        var images = $(imageLocation).find("img");
        images.each(function() { //goes through each of the image, by the end of this each biggestImageSrc will be updated to the last (biggest) image
          imageSrc = $(this).attr("src");
        });

        plot += "<br><a href='http://www.animenewsnetwork.com/encyclopedia/anime.php?id=" + animeId + "'  target='_blank'><font size='2'>(source:  Anime News Network)</font></a>"; //add source+link
      }
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
  function createAnimePanel(animeTitle, plot, epCount, airYear, imageSrc, ep1LinkObj) { //needs rating
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
        if (supportedStreamSites)
          ep1Button += "<a href=" + link + "  target='_blank' class='button  buttonEpLink " + siteColor + "' role='button'>" + siteName.toUpperCase() + " </a>"

      });

      ep1Button += "</div>" //close .ep1Text
    }

    //.imagePanel {height:400px;position:relative;display:block;overflow:hidden;}
    var panel = "<div class='col-md-4 col-centered col-max col-min form-group'><div class='block'> <p class ='animeTitle text-center' > " + animeTitle + "</p> <img class=' img-responsive center-block' src='" + imageSrc + "'> <p class='miniInfo text-left'>Total Episodes:" + epCount + "<span style='float:right'>Year aired on: " + airYear + " </span></p> <p class='plotSummary'>Plot Summary: </p> <p class='plotText text-left'>" + plot + " </p> "
    ep1Button += "</div> </div></div> "; //closure for panel
    panel += ep1Button; //puts ep1 buttons to panel

    //var panel ="<div class='col-xs-4'> <div class='panel panel-default'><div class='panel-heading'>Panel Heading</div><div class='panel-body'>Panel content</div></div>";

    $(".animeSuggestions").append(panel);

    $(".backBtn").prop("disabled", false); //anime panel loaded, enable back button
  }

  function getAnimeDataANN(animeTitle, callback) { // get anime info in xml from ANN

    $.ajax({
      type: "get",
      url: "http://cdn.animenewsnetwork.com/encyclopedia/api.xml?anime=~" + animeTitle,
      dataType: "xml",
      success: function(data) {
        /* handle data here */
        //xmlDoc = $.parseXML(data),
        $xml = $(data),
          $xml.find('ann').each(function() {
            var animeInfo = $xml.find('anime[name="' + animeTitle + '"]', 'anime[precision="TV"]'); //find corresponding TV series anime 
            callback(animeInfo);
          });

        //$("#type").html(data);
      },
      error: function(xhr, status) {
        console.log(animeTitle + ": error in getting data from ANN");
        callback(animeTitle);
      }
    });

  }

  //change region
  $(".region").click(function() {

    var curRegion = $(this).attr("data-value");

    $(".dropbtn").text(curRegion);
    //if(curRegion != "US"){
    //document.location = myURL + "#FR";
    //}
  });
});