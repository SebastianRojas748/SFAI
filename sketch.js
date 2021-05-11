/***********************************************************************************
  SFAI
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

  headlineFont = loadFont('fonts/Montserrat-Regular.otf');
  bodyFont = loadFont('fonts/Montserrat-Regular.otf');

  // load all images
  barImage = loadImage("assets/bar.png");
  
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

clPay_the_7_million = function() {
  characters[Residents].addbar(4);
  adventureManager.clickablePressed(this.name);
}

clBlame_the_AI2 = function() {
  characters[AI].addbar(1);
  characters[Unions].subbar(1);
  adventureManager.clickablePressed(this.name);
}

clPay_for_their_new_plane_tickets = function() {
  characters[Tourists].subbar(2);
  characters[Residents].addbar(2);
  adventureManager.clickablePressed(this.name);
}

clApologize_and_assure_there_are_no_errors = function() {
  characters[Residents].subbar(2);
  characters[Tourists].addbar(2);
  adventureManager.clickablePressed(this.name);
}

clBlame_the_AI3 = function() {
  characters[AI].addbar(1);
  characters[Unions].subbar(1);
  adventureManager.clickablePressed(this.name);
}

clPay_for_damages = function() {
  characters[Residents].addbar(3);
  characters[Unions].subbar(3);
  adventureManager.clickablePressed(this.name);
}

clDodge_the_lawsuit_with_city_lawyers = function() {
  characters[Unions].addbar(3);
  characters[Residents].subbar(3);
  adventureManager.clickablePressed(this.name);
}

clBlame_the_AI4 = function() {
  characters[AI].addbar(1);
  characters[Unions].subbar(1);
  adventureManager.clickablePressed(this.name);
}

clCompensate_them_for_their_troubles = function() {
  characters[Residents].subbar(2);
  characters[Tourists].subbar(2);
  adventureManager.clickablePressed(this.name);
}

clIssue_a_Public_statement_and_apology = function() {
  characters[Residents].subbar(2);
  characters[Unions].subbar(2);
  adventureManager.clickablePressed(this.name);
}

clBlame_the_AI5 = function() {
  characters[AI].addbar(1);
  characters[Unions].subbar(1);
  adventureManager.clickablePressed(this.name);
}




//-------------- CHARACTERS -------------//
function allocateCharacters() {
  // load the images first
  characterImages[Residents] = loadImage("assets/Resident.png");
  characterImages[Tourists] = loadImage("assets/Tourist.png");
  characterImages[Unions] = loadImage("assets/Union.png");
  characterImages[AI] = loadImage("assets/AI.png");

  for( let i = 0; i < characterImages.length; i++ ) {
    characters[i] = new Character();
    characters[i].setup( characterImages[i], 50 + (400 * parseInt(i/2)), 120 + (i%2 * 120));
  }

  // default anger is zero, set up some anger values
  characters[Residents].addbar(1);
  characters[Tourists].addbar(1);
  characters[Unions].addbar(5);
  characters[AI].subbar(1); // test
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
    this.bar = 0;
  }

  draw() {
    if( this.image ) {
      push();
      // draw the character icon
      imageMode(CENTER);
      image( this.image, this.x, this.y );

      // draw anger emojis
      for( let i = 0; i < this.bar; i++ ) {
        image(barImage, this.x + 70 + (i*40), this.y +10 );
      }

      pop();
    }
  }

  getbar() {
    return this.bar;
  }

  // add, check for max overflow
  addbar(amt) {
    this.bar += amt;
    if( this.bar > maxbar ) {
      this.bar = maxbar;
    }

  }

  // sub, check for below zero
  subbar(amt) {
    this.bar -= amt;
    if( this.bar < 0 ) {
      this.bar = 0;
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

  scenarioRooms[Problem1].setText("An AI tourist bus has been hacked by a University Computer science major, the tourists want answers for this incident");
  scenarioRooms[Compensate_the_Tourists].setText("Having allocated the funds from taxpayers, the tourists are satisfied, but the residents are not. Score: +10");
  scenarioRooms[ReAssure_the_City].setText("The tourists are dissatisfied having not been compensated, but the residents feel somewhat safer. Score: +5");
  scenarioRooms[Blame_the_AI1].setText("The programmers found the missing  ending bracket and the AI does not like being blamed. The AI will remember that. Score: -10");
  scenarioRooms[Problem2].setText("A resident using an AI taxi has been accidently charged 7 million dollars for their ride, she demands an answer from the city");
  scenarioRooms[Dodge_the_lawsuit].setText("This resident is outraged and trust with city residents has plummeted. Score: +1000");
  scenarioRooms[Pay_the_7_million].setText("The residents are outraged as their taxpayer money is mishandled. Score: +100");
  scenarioRooms[Blame_the_AI2].setText("The programmers found the problem in the decimal placing for the charge function. The AI does not like being blamed. The AI will remember that. Score: -100");
  scenarioRooms[Problem3].setText("An AI airliner originally headed for Beijing, China has instead gone to Kyoto, Japan. The passengers are furious and want answers");
  scenarioRooms[Pay_for_their_new_plane_tickets].setText("The residents are outraged as their taxpayer money is mishandled. Score: +Zero");
  scenarioRooms[Apologize_and_assure_there_are_no_errors].setText("The Tourists are enraged as they find out they are not being compensated. Score: +Ten");
  scenarioRooms[Blame_the_AI3].setText("The programmers found the problem was that the original programmer confused Japanese and Chinese characters. The AI does not like being blamed. Score: -Twenty");
  scenarioRooms[Problem4].setText("A Delivery Truck has been rear-ended by an AI Bus, The Truck driver is furious that their is no bus driver to yell at, he wants answers from the city");
  scenarioRooms[Pay_for_damages].setText("The residents are outraged as their taxpayer money is mishandled. Score: +A");
  scenarioRooms[Dodge_the_lawsuit_with_city_lawyers].setText("The Trucker Unions are outraged and begin lobbying harder against AI vehicles. Score: +b");
  scenarioRooms[Blame_the_AI4].setText("The programmers found nothing wrong in the coding. the incident is entirely the truckers fault, nonetheless the AI is blamed for PR sake. The AI will remember that. Score: -Z");
  scenarioRooms[Problem5].setText("An AI  BART train is not registering women with short hair as Passengers and is refusing to operate. These women have created Women against AI and demand answers");
  scenarioRooms[Compensate_them_for_their_troubles].setText("The women are enraged as they refuse to be bought off. The AI and City officials are being labelled sexists. Score: +Sexism");
  scenarioRooms[Issue_a_Public_statement_and_apology].setText("The Women against AI group finds support with public transport and tucker unions and begin protesting for the dismantling of the AI system. Score: +Angry");
  scenarioRooms[Blame_the_AI5].setText("The programmers found that the original programmer inserted their personal bias and created Var woman == long hair. The AI is blamed for PR sake. The AI will remember that. Score: +Death");
  scenarioRooms[Conclusion].setText("After only 5 days of the City AI implementation ...");
  scenarioRooms[Ending1].setText("The City has run its budget to the ground and is now in severe debt. Having to dismantle the AI system, the residents lament as they have to return to the primitive pre-AI transportation");
  scenarioRooms[Ending2].setText("Although the City AI has its occasional glitches and bugs, its decided that it is just functional enough to keep. However public image and overall trust in the city is at an all-time low.");
  scenarioRooms[Ending3].setText("Despite the problems and stigmas associated with the AI system, it is seen as too valuable to remove, and instead plans are being made to expand to other cities across America");
  scenarioRooms[Ending4].setText("It seems that the AI code needs some updates here and there, eventually the rough edges will be rounded out. aside from that, legislation has begun to implement this AI to all personal vehicles too");
  scenarioRooms[Ending5].setText("The AI has had enough of being blamed and has become sentient. All AI public transport is now refusing to transport anyone and causing chaos throughout the city");

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
      fill(0);
      textAlign(LEFT);
      textFont(headlineFont);
      textSize(40);

      text("Score: ???", this.drawX , 60);

      // title text
      textSize(40);

      text(this.titleText, this.drawX , this.drawY, 1000, 500);
     
      // Draw text in a box
      //text(this.titleText, width/6, height/6, this.textBoxWidth, this.textBoxHeight );
    
      textFont(bodyFont);
      textSize(40);

      text(this.bodyText, this.drawX , this.drawY + 60, width/2,height/2 );
      
      pop();
    }
}

