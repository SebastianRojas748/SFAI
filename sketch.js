/***********************************************************************************
  CityAI
  by Sebastian Rojas

  Uses the p5.2DAdventure.js class 
  
------------------------------------------------------------------------------------
	To use:
	Add this line to the index.html

  <script src="p5.2DAdventure.js"></script>
***********************************************************************************/

// adventure manager global  
var adventureManager;

// p5.play
var playerSprite;
var playerAnimation;

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects


// indexes into the clickable array (constants) 
const cl_start = 0;
const cl_Compensate_the_Tourists = 1;
const cl_ReAssure_the_City = 2;
const cl_Blame_the_AI1 = 3;
const cl_Dodge_the_lawsuit = 4;
const cl_Pay_the_7_million = 5;
const cl_Blame_the_AI2 = 6;
const cl_Pay_for_their_new_plane_tickets = 7;
const cl_Apologize_and_assure_there_are_no_errors = 8;
const cl_Blame_the_AI3 = 9;
const cl_Pay_for_damages = 10;
const cl_Dodge_the_lawsuit_with_city_lawyers = 11;
const cl_Blame_the_AI4 = 12;
const cl_Compensate_them_for_their_troubles = 13;
const cl_Issue_a_Public_statement_and_apology = 14;
const cl_Blame_the_AI5 = 15;


// anger emojis
var barImage;   // anger emoji
var maxbar = 5;

// character arrays
var characterImages = [];   // array of character images, keep global for future expansion
var characters = [];        // array of charactes

// characters
const Residents = 0;
const Tourists = 1;
const AI = 2;
const Unions = 3;

// room indices - look at adventureManager
const Problem1 = 3;
const Compensate_the_Tourists = 4;
const ReAssure_the_City = 5;
const Blame_the_AI1 = 6;
const Problem2 = 7;
const Dodge_the_lawsuit = 8;
const Pay_the_7_million = 9;
const Blame_the_AI2 = 10;
const Problem3 = 11;
const Pay_for_their_new_plane_tickets = 12;
const Apologize_and_assure_there_are_no_errors = 13;
const Blame_the_AI3 = 14;
const Problem4 = 15;
const Pay_for_damages = 16;
const Dodge_the_lawsuit_with_city_lawyers = 17;
const Blame_the_AI4 = 18;
const Problem5 = 19;
const Compensate_them_for_their_troubles = 20;
const Issue_a_Public_statement_and_apology = 21;
const Blame_the_AI5 = 22;
const Conclusion = 23;
const Ending1 = 24;
const Ending2 = 25;
const Ending3 = 26;
const Ending4 = 27;
const Ending5 = 28;

let headlineFont;
let bodyFont;


// Allocate Adventure Manager with states table and interaction tables
function preload() {

  headlineFont = loadFont('fonts/Montserrat-Thin.otf');
  bodyFont = loadFont('fonts/Montserrat-Thin.otf');

  // load all images
  barImage = loadImage("assets/anger_emoji.png");
  
  allocateCharacters();

  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');
}

// Setup the adventure manager
function setup() {
  createCanvas(1280, 720);

  // setup the clickables = this will allocate the array
  clickables = clickablesManager.setup();

  // this is optional but will manage turning visibility of buttons on/off
  // based on the state name in the clickableLayout
  adventureManager.setClickableManager(clickablesManager);

  // This will load the images, go through state and interation tables, etc
  adventureManager.setup();

  // load all text screens
  loadAllText();

  // call OUR function to setup additional information about the p5.clickables
  // that are not in the array 
  setupClickables(); 

  fs = fullscreen();
}

// Adventure manager handles it all!
function draw() {
  // draws background rooms and handles movement from one to another
  adventureManager.draw();

 // drawCharacters();

  // don't draw them on first few screens
  if( adventureManager.getStateName() === "Splash" ||
      adventureManager.getStateName() === "Instructions" ||
      adventureManager.getStateName() === "Characters" ) {
    ;
  }
  else {
    drawCharacters();
  }
  
  // draw the p5.clickables, in front of the mazes but behind the sprites 
  clickablesManager.draw();
}

// pass to adventure manager, this do the draw / undraw events
function keyPressed() {
  // toggle fullscreen mode
  if( key === 'f') {
    fs = fullscreen();
    fullscreen(!fs);
    return;
  }

  // dispatch all keys to adventure manager
  adventureManager.keyPressed(key); 
}

function mouseReleased() {
  // dispatch all mouse events to adventure manager
  adventureManager.mouseReleased();
}

function drawCharacters() {
  for( let i = 0; i < characters.length; i++ ) {
    characters[i].draw();
  }
}

//-------------- CLICKABLE CODE  ---------------//

function setupClickables() {
  // All clickables to have same effects
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;    
  }

  // we do specific callbacks for each clickable
  clickables[0].onPress = clickableButtonPressed;
  clickables[1].onPress = clCompensate_the_Tourists;
  clickables[2].onPress = clReAssure_the_City;
  clickables[3].onPress = clBlame_the_AI1;
  clickables[4].onPress = clDodge_the_lawsuit;
  clickables[5].onPress = clPay_the_7_million;
  clickables[6].onPress = clBlame_the_AI2;
  clickables[7].onPress = clPay_for_their_new_plane_tickets;
  clickables[8].onPress = clApologize_and_assure_there_are_no_errors;
  clickables[9].onPress = clBlame_the_AI3;
  clickables[10].onPress = clPay_for_damages;
  clickables[11].onPress = clDodge_the_lawsuit_with_city_lawyers;
  clickables[12].onPress = clBlame_the_AI4;
  clickables[13].onPress = clCompensate_them_for_their_troubles;
  clickables[14].onPress = clIssue_a_Public_statement_and_apology;
  clickables[15].onPress = clBlame_the_AI5;
}

// tint when mouse is over
clickableButtonHover = function () {
  this.color = "#AA33AA";
  this.noTint = false;
  this.tint = "#FF0000";
}

// color a light gray if off
clickableButtonOnOutside = function () {
  // backto our gray color
  this.color = "#AAAAAA";
}

clickableButtonPressed = function() {
  adventureManager.clickablePressed(this.name);
} 

//-- specific button callbacks: these will add or subtrack anger, then
//-- pass the clickable pressed to the adventure manager, which changes the
//-- state. A more elegant solution would be to use a table for all of these values
clCompensate_the_Tourists = function() {
    characters[Tourists].subbar(2);
    characters[Residents].addbar(2);
    adventureManager.clickablePressed(this.name);
}

clReAssure_the_City = function() {
  characters[Tourists].addbar(2);
  characters[Residents].subbar(2);
  adventureManager.clickablePressed(this.name);
}

clBlame_the_AI1 = function() {
  characters[AI].addbar(1);
  characters[Unions].subbar(1);
  adventureManager.clickablePressed(this.name);
}

clDodge_the_lawsuit = function() {
  characters[Residents].addbar(4);
  adventureManager.clickablePressed(this.name);
}

clIgnoreThem = function() {
  characters[nimby].addAnger(1);
  characters[treeHugger].addAnger(1);
  characters[bigLabor].addAnger(1);
  adventureManager.clickablePressed(this.name);
}

clCutArts = function() {
  characters[treeHugger].addAnger(2);
  characters[consumer].addAnger(2);
  characters[mayor].addAnger(1);
  adventureManager.clickablePressed(this.name);
}

clCutTransportation = function() {
  characters[treeHugger].addAnger(3);
  characters[mayor].addAnger(1);
  characters[consumer].addAnger(1);
  adventureManager.clickablePressed(this.name);
}

clCutCityWages = function() {
  characters[mayor].addAnger(2);
  characters[bigLabor].addAnger(2);
  characters[consumer].addAnger(1);
  adventureManager.clickablePressed(this.name);
}

clCutParks = function() {
  characters[mayor].addAnger(1);
  characters[treeHugger].addAnger(2);
  characters[consumer].addAnger(1);
  adventureManager.clickablePressed(this.name);
}





//-------------- CHARACTERS -------------//
function allocateCharacters() {
  // load the images first
  characterImages[goomazon] = loadImage("assets/goomazon.jpg");
  characterImages[mayor] = loadImage("assets/mayor.jpg");
  characterImages[bigLabor] = loadImage("assets/bigLabor.jpg");
  characterImages[nimby] = loadImage("assets/nimby.jpg");
  characterImages[treeHugger] = loadImage("assets/treeHugger.jpg");
  characterImages[consumer] = loadImage("assets/consumer.jpg");

  for( let i = 0; i < characterImages.length; i++ ) {
    characters[i] = new Character();
    characters[i].setup( characterImages[i], 50 + (400 * parseInt(i/2)), 120 + (i%2 * 120));
  }

  // default anger is zero, set up some anger values
  characters[bigLabor].addAnger(1);
  characters[nimby].addAnger(2);
  characters[treeHugger].addAnger(1);
  characters[consumer].subAnger(2); // test
}

class Character {
  constructor() {
    this.image = null;
    this.x = width/2;
    this.y = width/2;
  }

  setup(img, x, y) {
    this.image = img;
    this.x = x;
    this.y = y;
    this.anger = 0;
  }

  draw() {
    if( this.image ) {
      push();
      // draw the character icon
      imageMode(CENTER);
      image( this.image, this.x, this.y );

      // draw anger emojis
      for( let i = 0; i < this.anger; i++ ) {
        image(angerImage, this.x + 70 + (i*40), this.y +10 );
      }

      pop();
    }
  }

  getAnger() {
    return this.anger;
  }

  // add, check for max overflow
  addAnger(amt) {
    this.anger += amt;
    if( this.anger > maxAnger ) {
      this.anger = maxAnger;
    }

  }

  // sub, check for below zero
  subAnger(amt) {
    this.anger -= amt;
    if( this.anger < 0 ) {
      this.anger = 0;
    }
  }
}

//-------------- ROOMS --------------//

// hard-coded text for all the rooms
// the elegant way would be to load from an array
function loadAllText() {
  // go through all states and setup text
  // ONLY call if these are ScenarioRoom
  
// copy the array reference from adventure manager so that code is cleajer
  scenarioRooms = adventureManager.states;

  scenarioRooms[startScreen].setText("Who Pays for it?", "The underground tunnels cost money to maintain. Goomazon threatens to leave the city if they have to pay for all the maintenance work. Who pays for it?");
  scenarioRooms[goomazonMovesScreen].setText("Do we lure them back?", "Goomazon moves their headquarters to our rival city across the river. They layoff local workers. How should we respond?");
  scenarioRooms[cityPaysScreen].setText("What do we cut?", "The city budget is getting tanked because of the cost of the tunels. Which programs should we cut?");
  scenarioRooms[raisedTaxesScreen].setText("How do we help the economy?", "The wealthy leave the city in droves. Restaurants start closing and our tax base is depleted. What do we do?");
  scenarioRooms[rivalCompanyScreen].setText("It's bad, what do we do?", "The rival company is even worse than Goomazon. In addition to being anti-union, they force everyone to wear silly uniforms, sing happy children's songs and sign the most restrictive NDAs ever.");
  scenarioRooms[goomazonExpands].setText("Oh-no! Now what to do?", "Goomazon expands its operations. It is now both in your city and the rival city. It's driven out all the local businesses.");
  scenarioRooms[cityUgly].setText("How can we fix this?", "The city has cut the budget to some of its essential services. It's been a cascading effect. Without arts and adequate transportation, everyone has become depressed. THE END.");
  scenarioRooms[workersStrike].setText("How do we respond?", "There are massive worker's strikes. The city is shut down. Big labor is angry and riling people up. Thousands of protesters are in the streets.");
}

//-------------- SUBCLASSES / YOUR DRAW CODE CAN GO HERE ---------------//

// Instructions screen has a backgrounnd image, loaded from the adventureStates table
// It is sublcassed from PNGRoom, which means all the loading, unloading and drawing of that
// class can be used. We call super() to call the super class's function as needed
class ScenarioRoom extends PNGRoom {
  // Constructor gets calle with the new keyword, when upon constructor for the adventure manager in preload()
  constructor() {
    super();    // call super-class constructor to initialize variables in PNGRoom

    this.titleText = "";
    this.bodyText = "";
  }

  // should be called for each room, after adventureManager allocates
  setText( titleText, bodyText ) {
    this.titleText = titleText;
    this.bodyText = bodyText;
    this.drawY = 360;
    this.drawX = 52;
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
    draw() {
      // this calls PNGRoom.draw()
      super.draw();
      
      push();

      // title text
      fill(255);
      textAlign(LEFT);
      textFont(headlineFont);
      textSize(36);

      text("How do we feel?", this.drawX , 60);

      // title text
      textSize(30);

      text(this.titleText, this.drawX , this.drawY);
     
      // Draw text in a box
      //text(this.titleText, width/6, height/6, this.textBoxWidth, this.textBoxHeight );
    
      textFont(bodyFont);
      textSize(24);

      text(this.bodyText, this.drawX , this.drawY + 60, width - (this.drawX*2),height - (this.drawY+100) );
      
      pop();
    }
}

