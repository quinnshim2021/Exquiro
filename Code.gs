// initialize script property object
let scriptProperties = PropertiesService.getScriptProperties();

/* gets all paragraphs, currently selected text, current paragraph */
function getText() {
  let doc = DocumentApp.getActiveDocument();
  let body = doc.getBody();
  let currContext = '';
  let selected = '';
  
  let s = doc.getSelection();
  if (s){
    // get start and end of partial paragraph (WILL BE BUGGY IF MORE THAN ONE ELEMENT IS SELECTED, doesn't work on anything but paragraphs)
    // ^^ but does work on any inline paragraph such as hyperlinks, bold, italics, etc
    let start = s.getRangeElements()[0].getStartOffset();
    let end = s.getRangeElements()[0].getEndOffsetInclusive();
    
    selected = s.getRangeElements()[0].getElement().asText().getText().substring(start, end+1);
    currContext = s.getRangeElements()[0].getElement().asText().getText();
  }else{
    currContext = doc.getCursor().getElement().asText().getText();
  }
  
  scriptProperties.setProperties({
    'document': body.getParagraphs(),
    'fullText': body.getText(),//added for easy of use in getting full document text. - Matthew
    'currContext': currContext,
    'selectedText': selected
  });
}

/* text to be displayed to sidebar */
function NLP(){
  getText();
  
  let fullDoc = scriptProperties.getProperty('document'); // gets full document and current paragraph so it's ready to be processed
  let currContext = scriptProperties.getProperty('currContext');
  let selectedText = scriptProperties.getProperty('selectedText');
  let fullDocumentText = scriptProperties.getProperty('fullText');//Matthew didn't know how to use fullDoc variable so he made this.
  
  //Matthew's suggestion: Doesn't seem to run very fast if at all.
  //let importantWords = [rake(fullDocumentText)[0], rake(currContext)[0], selectedText === '' ? '' : rake(selectedText).length > 1 ? rake(selectedText)[0] + " " + rake(selectedText)[1] : rake(selectedText)[0]];
  
  let importantWords = [rake(currContext)[0], selectedText === '' ? '' : rake(selectedText).length > 1 ? rake(selectedText)[0] + " " + rake(selectedText)[1] : rake(selectedText)[0]];
  return importantWords.join(" "); 
  // ^^ a lot more accurate than the line below in terms of search results, rake on full doc text is fucking weird rn
 
  //rake testing. comment me out to test other stuff
  //return selectedText === '' ? rake(currContext)[0] : rake(selectedText)[0]; 
}

/* on open, will create a menu item in add ons for this script */
function onOpen() {
  DocumentApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .createMenu('Custom Menu')
      .addItem('Exquiro', 'doGet')
      .addToUi();
}

/* opens index.html as the sidebar */
function doGet(){
  var html = HtmlService
      .createTemplateFromFile('index')
      .evaluate()
      .setTitle("Exquiro");
  DocumentApp.getUi().showSidebar(html);
}