


document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views


  document.querySelector('#sent').addEventListener('click', get_sent_mail);
  document.querySelector('#archived').addEventListener('click', get_archived_mail);
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#send-email').addEventListener('click', send_email );
  document.querySelector('#inbox').addEventListener('click', get_inbox_mail);

  

  // By default, load the inbox


});


function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').innerHTML = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}


function load_mailbox(mailbox) {

  
  // Show the mailbox and hide other views
  
  document.querySelector('#emails-view').innerHTML = '';
  document.querySelector('#emails-view').style.display = 'block';

  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  var to_print = "<h3> Inbox </h3>"
  
  for(i=0; i< mailbox.length; i++){
     if(mailbox[i].read == true){
      to_print += `<div class="read" id=${mailbox[i].id}> <h5 class="mail_title"> <b>  &nbsp; ${mailbox[i].sender} </b> &nbsp;  ${mailbox[i].subject} <h6 class="mail_timestamp">${mailbox[i].timestamp}</h6> </h5>   </div>`;
     }
     else{
      to_print += `<div class="unread" id=${mailbox[i].id}> <h5 class="mail_title"><b>  &nbsp; ${mailbox[i].sender} </b>  &nbsp; ${mailbox[i].subject} <h6 class="mail_timestamp">${mailbox[i].timestamp}</h6> </h5>  </div>`;
     }
     
  }
  document.querySelector('#emails-view').innerHTML = to_print;


  var elements = document.getElementsByClassName("read");
 
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', get_message.bind(null, elements[i].id), false);
  }

  var ur_elements = document.getElementsByClassName("unread");

  for (var i = 0; i < ur_elements.length; i++) {
    ur_elements[i].addEventListener('click', get_message.bind(null, ur_elements[i].id), false);
  }
}

function send_email(){
  
  console.log("sending email");
  const response = fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        sender: document.getElementById('sender').value,
        recipients: document.getElementById('compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value,
        

    })
  })  

}

async function set_read(id){

  var response = await fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })

}

async function set_unread(id){

  var response = await fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: false
    })
  })

}


async function archive_mail(id){
  console.log(`about to send archive request`)
  
  var response = await fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true,
        archived: true
    })
  })
 
  
  get_inbox_mail();
  
}

async function unarchive_mail(id){
  var response = await fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true,
        archived: false
    })
  })
  get_inbox_mail();
  
}

async function get_inbox_mail(){

  console.log("fetching inbox")
  var response = await fetch('/emails/inbox')
  const body = await response.json();
  console.log(body)
  load_mailbox(body);
  
}

async function get_sent_mail(){

  var response = await fetch('/emails/sent')
  const body = await response.json();
  load_mailbox(body);
  
}

async function get_archived_mail(){

  var response = await fetch('/emails/archive')
  const body = await response.json();
  load_mailbox(body);
  
}

async function get_message(id){
  console.log(`Opening message with id: ${id}`)

  var response = await fetch(`/emails/${id}`)
  const body = await response.json();
  console.log(body)
  
  open_mail(body)
  
}


function open_mail(message){
  
  
  set_read(message.id);
  document.querySelector('#emails-view').innerHTML = '';
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  
  if(message.archived === false){
    var archive = `<button value="archive" id="archive">Archive </button>`
  }
  else{
    var archive = `<button value="unarchive" id="unarchive"> Unarchive</button>`
  }
 

  var display = `<button id='reply' value='reply'> Reply </button> ${archive} 
  <hr>
  <h5>From: ${message.sender} <br> To: ${message.recipients} </h5> 
  <h5>Sent at: ${message.timestamp} <h5>
  <h5>Email Subject: ${message.subject} </h5>
  <hr>
   <h5>${message.body} </h5>`;




  document.querySelector('#emails-view').innerHTML = display;
  if(message.archived === false){
 
    document.getElementById('archive').addEventListener('click', () => {  archive_mail(message.id)}, false)
    // () => { alert.bind(null, "archive clicked"), archive_mail.bind(null, mesage.id),  get_inbox_mail}, false)
  }
  else{
    
    document.getElementById('unarchive').addEventListener('click', () => {unarchive_mail(message.id),  get_inbox_mail()}, false)
  }
  
  document.getElementById('reply').addEventListener('click', () => {  get_reply_message(message.id)}, false)
  

}

async function get_reply_message(id){

  var response = await fetch(`/emails/${id}`)
  const body = await response.json();
  console.log(body)
  
  reply_email(body)
  
}

function reply_email(message) {


  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = `${message.sender}`;
  if(message.subject.substring(0, 3) == "RE:"){
    document.querySelector('#compose-subject').value = `${message.subject}`;
  }
  else{
    document.querySelector('#compose-subject').value = `RE:${message.subject}`;
  }
  
  document.querySelector('#compose-body').value = `\n----------------------------- \nFrom: ${message.sender} \nTo: ${message.recipients} \nSent On:${message.timestamp} \nSubject: ${message.subject} \n----------------------------- \n ${message.body}`;
}


