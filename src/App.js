import logo from './logo.svg';
import './App.css';

import React, { useRef, useState, useEffect } from 'react';
//import SpeechRecognition, { useSpeechRecognition, useSpeechSynthesis } from 'react-speech-kit';
//import { useSpeechRecognition, useSpeechSynthesis } from 'react-speech-kit';
import Textarea from 'react-textarea-autosize';
import Text from 'react-text';
import {Container, Row, Col} from 'react-grid';
import './App.css';
import BookLinks from './BookLinks';

import emailjs from '@emailjs/browser';
import { useTranslation } from 'react-i18next';
//import './i18n';
import LanguageSelector from "./LanguageSelector";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "YOUR FIREBASE API KEY",
  authDomain: "asistente-tienda-ia.firebaseapp.com",
  projectId: "asistente-tienda-ia",
  storageBucket: "asistente-tienda-ia.appspot.com",
  messagingSenderId: "176372016537",
  appId: "1:176372016537:web:dc659f7803fc1a8b5ddf08"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


function App() {
//  	const [name, setName] = useState('Godswill');

  const [text, setText] = useState('');
  const [responseText, setResponseText] = useState('Response');

//  const [results, setResults] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);

  const [message, setMessage] = useState('Escribe aqui / Write here');
  //setMessage(t("request"));

  const [updated, setUpdated] = useState(message);

  const [value, setValue] = useState('');
  const [status, setStatus] = useState('');

// Contains the value and text for the options
const languages = [
  { value: '', text: "Language" },
//  { value: 'es', text: "Spanish" },
  { value: 'en', text: "English" },
  { value: 'es', text: "Spanish" }
];

    // It is a hook imported from 'react-i18next'
    const { t } = useTranslation(); 
  
    const [lang, setLang] = useState('');
    const handleLanguage = e => { 
      console.log(e.target.value);
      setLang(e.target.value);
//      let loc = "http://localhost:3000/";
//      window.location.replace(loc + "?lng=" + e.target.value);
//TODO: set loc to "https://library-ai-assistant.web.app/" and use it instead of window.location.href since
//it currently is adding lng to current url so if changing several times the language then it does not work
      window.location.replace(window.location.href + "?lng=" + e.target.value);

  }

//  const EmailContactForm = () => {
    const form = useRef();
    
    const sendEmail = (e) => {
      e.preventDefault(); // prevents the page from reloading when you hit “Send”
      setStatus('Message being sent');
      emailjs.sendForm('service_gvhd4f6', 'template_s462oj9', form.current, 'YOUR EMAILJS API KEY')
        .then((result) => {
            // show the user a success message
            alert('Message sent');
            setStatus('');
        }, (error) => {
            // show the user an error
        });
    };
//  };

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleClickText = (event) => {
    setMessage("");
  };

  const handlePressEnter = (event) => {
    if(event.keyCode == 13 && event.shiftKey == false) {
      event.preventDefault();
      return handleClick();
    };
  }

/*
  curl https://api.openai.com/v1/chat/completions \
 -H "Authorization: Bearer $OPENAI_API_KEY" \
 -H "Content-Type: application/json" \
 -d '{
 "model": "gpt-3.5-turbo",
 "messages": [{"role": "user", "content": "What is the OpenAI mission?"}] 
 }'
*/
 const handleClick = () => {
  // 👇 "message" stores input field value
  //setUpdated(message);
  setMessage(message);
  const request = 'You are a helpful Store assistant helping to find the products that I Will ask about and open to talk about anything \
  related to products. You must ask no question at all, just provide answer to the user question or provide product recommendations. \
  Then You must provide every product title, including both product brand and model, between these two characters []. \
  You must say the answer in the same language as the request';
  const user_msg = 'You must say the answer in the same language as the request. If the request is not related to products at all, \
  kindly reject the request saying Sorry, I am a Store assistant, \
  I only know about products. Please, tell me about the product you want or ask me anything related to products. My request is:' + message;
 /*
  const request = 'You are a helpful Library assistant helping to find the books that I Will ask about and open to talk about anything \
  related to books. You must ask no question at all, just provide answer to the user question or provide book recommendations. \
  You must provide every book title, also the one mentioned by the user, between these two characters []. \
  You must say the answer in the same language as the request';
  const user_msg = 'You must say the answer in the same language as the request. If the request is not related to books at all, kindly reject the request saying Sorry, I am a librarian, \
  I only know about books. Please, tell me about the book you want or ask me anything related to books.  My request is:' + message;
 */ 
  setResponseText(t("waitingAnswer"));
  const payload = {
    'model': 'gpt-3.5-turbo',
//      'model': 'gpt-3.5-turbo',      
//      'prompt': message,
    "messages": [{"role": "user", "content": user_msg}, {"role": "system", "content": request}],
//    'prompt': request,
    'max_tokens': 256,
    'temperature': 0.7
  }

  fetch("https://api.openai.com/v1/chat/completions", {
     method: 'POST',
     headers:{
      'content-type': 'application/json', 
      'Authorization': 'Your OpenAI API KEY' 
     },
     body: JSON.stringify(payload)
  }).then((result)=>{
      result.json().then((resp)=>{
        setResponseText(resp['choices'][0]['message']['content']);
        const emailContent = 'REQUEST: ' + message + ' RESPONSE: ' + resp['choices'][0]['message']['content'];
        emailjs.send('service_gvhd4f6', 'template_s462oj9', {message: emailContent }, 'Your emailjs API KEY');                
      })
     })

};

  return (
    <div className="App">
      <header className="App-header">
      <script 
      async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9167815304869842"
     crossorigin="anonymous">
     </script>
            <select 
                style={{ fontFamily: 'Arial', fontSize: '24px' }}
                value={lang} onChange={handleLanguage}>
                {languages.map(item => {
                    return (<option key={item.value} 
                    value={item.value}>{item.text}</option>);
                })}
            </select>

  <Container style={{textAlign: "center", justifyContent: "center"}}>
    <Row>
      <Col style={{textAlign: "center", justifyContent: "center", fontSize: '30px'}}>{t("notesTitle")}
      <Row style={{textAlign: "center", justifyContent: "center"}}>
      <Textarea 
        className="textarea" 
        style={{width: 350, fontSize: '20px', fontFamily: 'Verdana'}}
        name="notes"
        value={t("notes_products")}
        maxLength={300}
      />
      </Row>
      </Col>
      <Col style={{justifyContent: "center", fontSize: '30px'}}>{t("requestTitle")}
      <Row style={{textAlign: "center", justifyContent: "center"}}>
      <Textarea 
        className="textarea" 
        style={{width: 350, height:'40px', fontSize: '20px', fontFamily: 'Verdana'}}
        name="message"
        onClick={handleClickText}
        onChange={handleChange}
        onKeyDown={handlePressEnter}
        value={message}
        maxLength={300}
      />
      </Row>
      <p/>
      <Row style={{justifyContent: "center"}}>
      <button 
        style={{ fontFamily: 'Arial', fontSize: '24px' }}
        onClick={handleClick}>{t("enviar")}</button>
      </Row>
      <p/>
      <Row style={{textAlign: "center", justifyContent: "center"}}>
      <textarea 
        style={{ overflow: 'auto', maxHeight: 300, height: 250, width: 350, fontSize: '20px', fontFamily: 'Verdana' }}
        value={responseText} 
      />
      </Row>
      </Col>
      <Col style={{fontSize: '30px'}}>{"Productos"}

  			<BookLinks str={responseText} />

        <Row style={{textAlign: "center", justifyContent: "center", background: "white"}}>
          <a target="_blank" href="https://amzn.to/3XoWWhA">Libros en Amazon</a>
        </Row>
        <p/>


        <Row style={{textAlign: "center", justifyContent: "center", background: "white"}}>
          <a target="_blank" href="https://www.amazon.es/gp/bestsellers/books/?_encoding=UTF8&linkCode=ib1&tag=YOUR_AFFILIATE_ID&linkId=bc35c7f99bd4bf0eacc324b727cede89&ref_=ihub_curatedcontent_4f72045b-91eb-4d1b-a06c-0ebbf22fedc5">Los más vendidos en Libros</a>
        </Row>
        <p/>
        <Row style={{textAlign: "center", justifyContent: "center", background: "white"}}>
          <a target="_blank" href="https://www.amazon.es/hz/audible/mlp/membership/plus?actionCode=AMSTM1450129210001&tag=YOUR_AFFILIATE_ID&_encoding=UTF8&linkCode=ib1&linkId=cb5c0ccb0383073345e23060e9eb6a96&ref_=ihub_curatedcontent_3f05db5b-9725-4e21-bc58-828b7d7173e0">Audible: miles de audiolibros y contenido exclusivo</a>
        </Row>
        <p/>
        <Row style={{textAlign: "center", justifyContent: "center"}}>
        <iframe 
        sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin" 
        style={{width:'120px', height:'240px'}} 
        marginwidth="0" 
        marginheight="0" 
        scrolling="no" 
        frameborder="0" 
        src="//rcm-eu.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=YOUR_AFFILIATE_ID&language=es_ES&o=30&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=8491293558&linkId=e4f54ed0e3182015631b7107730f98a1">

        </iframe>
        <iframe 
        sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin" 
        style={{width:'120px', height:'240px'}} 
        marginwidth="0" 
        marginheight="0" 
        scrolling="no" 
        frameborder="0" 
        src="//rcm-eu.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=YOUR_AFFILIATE_ID&language=es_ES&o=30&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=8401029813&linkId=67e8345ea5d9cccd0d1e62c99da62fdb">
        </iframe>
        <iframe 
        sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin" 
        style={{width:'120px', height:'240px'}} 
        marginwidth="0" 
        marginheight="0" 
        scrolling="no" 
        frameborder="0" 
        src="//rcm-eu.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=YOUR_AFFILIATE_ID&language=es_ES&o=30&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=8467064870&linkId=cab5b69660f4cec7b19a0f4ee14f58c7">
        </iframe>
        </Row>
        <Row style={{textAlign: "center", justifyContent: "center"}}>
          <iframe 
          sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin" 
        style={{width:'120px', height:'240px'}} 
        marginwidth="0" 
        marginheight="0" 
        scrolling="no" 
        frameborder="0" 
        src="//rcm-eu.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=YOUR_AFFILIATE_ID&language=es_ES&o=30&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=8408257331&linkId=eea00285c9a42dc652561cddeb162a44">
        </iframe>
        <iframe           
        sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin" 
        style={{width:'120px', height:'240px'}} 
        marginwidth="0" 
        marginheight="0" 
        scrolling="no" 
        frameborder="0"
        src="//rcm-eu.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=YOUR_AFFILIATE_ID&language=es_ES&o=30&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=8408149539&linkId=3ee806a5da8dbdef21f7b40ec0f5c9a0">
        </iframe>
        <iframe           
        sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin" 
        style={{width:'120px', height:'240px'}} 
        marginwidth="0" 
        marginheight="0" 
        scrolling="no" 
        frameborder="0"
        src="//rcm-eu.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=YOUR_AFFILIATE_ID&language=es_ES&o=30&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=8408265601&linkId=ce6a58538ef87a18ebcd7c412fb7edee">
        </iframe>
        </Row>
      </Col>
      </Row>
      <Row>
      <Col style={{justifyContent: 'left'}}>
        <Row style={{fontSize: '30px', textAlign: "center", justifyContent: "center", background: "white", width: 270}}>
          <a target="_blank" href="https://inteligencia-artificial-para-todos.blogspot.com/">Blog de IA</a>
        </Row>
        <Row style={{justifyContent: "center",fontSize: '30px', width: 270}}>
          {t("contactUs")}
        </Row>
        <Row>
      <form ref={form} onSubmit={sendEmail}>
      <Row style={{justifyContent: 'left'}}>
    <Col style={{justifyContent: 'left'}}>
     <label>{t("name")}</label>
     </Col>
     <Col>
     <input style={{ width: 150 }} type="text" name="user_name" />
     </Col>
     </Row>
     <Row style={{justifyContent: 'left'}}>
     <Col style={{justifyContent: 'left'}}>
     <label style={{textAlign: 'right'}}>{t("email")}  </label>
     </Col>
     <Col>
     <input style={{ width: 150 }} type="email" name="user_email" />
     </Col>
     </Row>
     <Row style={{justifyContent: 'left'}}>
     <Col style={{justifyContent: 'left'}}>
     <label>{t("message")}</label>
     </Col>
     <Col>
     <textarea style={{ width: 150 }} name="message" />
     </Col>
     </Row>
     <Row style={{justifyContent: 'center'}}>
      <Col></Col>
      <Col>
     <input 
      style={{ fontFamily: 'Arial', fontSize: '24px' }}
      type="submit" 
      value={t("enviar")} 
      />
     </Col>
     </Row>
     <Row style={{justifyContent: 'left'}}>
     <Col style={{justifyContent: 'left'}}>
     <label>{t("status")}</label>
     </Col>
     <Col>
     <textarea style={{ width: 150 }}
        name="status" 
        value={status}
    />
    </Col>
     </Row>
   </form>
           </Row>
      </Col>
    </Row>
    <p/>
  </Container>
  <text style={{ fontFamily: 'Arial', fontSize: '14px' }}>En calidad de Afiliado de Amazon, 
    obtengo ingresos por las compras adscritas que cumplen los requisitos aplicables
  </text>
  </header>
  </div>
  );
}

export default App;
