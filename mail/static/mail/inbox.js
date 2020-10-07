


document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views


  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#send-email').addEventListener('click', send_email );
  document.querySelector('#inbox').addEventListener('click', get_inbox_mail);

  

  // By default, load the inbox


});

function open_mail(message){
  
  
  console.log("opening an email")
  document.querySelector('#emails-view').innerHTML = '';
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  

  var display = `<h4> ID: ${message.id}  Email Subject: ${message.subject} </h4> <h5>From: ${message.sender} Sent at: ${message.timestamp}</h5> <h5>${message.body} </h5>`


  document.querySelector('#emails-view').innerHTML = display;

}

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

  console.log(`logging length ${mailbox.length}`);
  // Show the mailbox name
  var to_print = "<h3> Inbox </h3>"
  
  for(i=0; i< mailbox.length; i++){
     if(mailbox[i].read == true){
      to_print += `<div id=${mailbox[i].id} class="read"> <h5>id=${mailbox[i].id} message from: ${mailbox[i].sender}  Subject:${mailbox[i].subject}</h5> <h6>${mailbox[i].timestamp}</h6>  </div>`;
     }
     else{
      to_print += `<div id=${mailbox[i].id} class="unread"> <h5>id=${mailbox[i].id} message from: ${mailbox[i].sender}  Subject:${mailbox[i].subject}</h5> <h6>${mailbox[i].timestamp}</h6>  </div>`;
     }
     
  }
  document.querySelector('#emails-view').innerHTML = to_print;


  var elements = document.getElementsByClassName("read");
 
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', get_message.bind(null, elements[i].id, mailbox.length), false);
  }

  var ur_elements = document.getElementsByClassName("unread");

  for (var i = 0; i < ur_elements.length; i++) {
    ur_elements[i].addEventListener('click', get_message.bind(null, ur_elements[i].id, mailbox.length), false);
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
        body: document.querySelector('#compose-body').value 
    })
  })

  console.log("post response:", response)

  

}

async function get_inbox_mail(){

  var response = await fetch('/emails/inbox')
  const body = await response.json();
  
  
  console.log(`body of message is ${body}`)
  load_mailbox(body);
  // .then(response => response.json())
  // .then(emails => {
  //     // Print emails
  //     console.log(emails);
  //     load_mailbox(emails);
      

  //     // ... do something else with emails ...
  // });

  
}

async function get_message(id, len){
  console.log(`Opening message with id: ${id}`)

  var response = await fetch('/emails/inbox')
  const body = await response.json();
  var loc = len-id;
  
  debugger
  console.log(`body of message is ${body}`)
  open_mail(body[loc])
  // .then(response => response.json())
  // .then(emails => {
  //     // Print emails
  //     console.log(emails);
  //     load_mailbox(emails);
      

  //     // ... do something else with emails ...
  // });

  
}


