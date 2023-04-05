import React from 'react';
import {Row} from 'react-grid';


const ShowOneBookLink = ({book}) => {
//    const mylink="https://www.amazon.es/gp/search?ie=UTF8&tag=libraryaiassi-21&linkCode=ur2&linkId=25b1db6551e90c24752993627f2e6551&camp=3638&creative=24630&index=books&keywords=";

    const mylink="https://www.amazon.es/gp/search?ie=UTF8&tag=libraryaiassi-21&linkCode=ur2&linkId=25b1db6551e90c24752993627f2e6551&camp=3638&creative=24630&keywords=";
    const booklink=mylink+book;
    return (
      <div>
      <Row style={{textAlign: "center", justifyContent: "center", background: "white"}}>
        <a target="_blank" href={booklink}>{book}</a>
      </Row>
      <p/>
      </div>
    )
  };  
  
  const BookLinks = ({ str }) => {
            const result=[];
          // Stores the indices of
          let dels = [];
          for(let i = 0; i < str.length; i++)
          {
   
              // If opening delimiter
              // is encountered
              if (str[i] == '[')
              //if (str[i] == "'")
  
              {
                  dels.push(i);
              }
   
              // If closing delimiter
              // is encountered
              else if ((str[i] == ']') &&
              //else if ((str[i] == "'") &&
                       (dels.length > 0))
              {
   
                  // Extract the position
                  // of opening delimiter
                  let pos = dels[dels.length - 1];
   
                  dels.pop();
   
                  // Length of substring
                  let len = i - 1 - pos;
   
                  // Extract the substring
                  let ans;
  /*                if(pos < len)
                  {
                      ans = str.substring(pos + 1,
                                         len + 1);
                  }
                  else{
                      ans = str.substring(pos + 1,
                            len + pos + 1);
                  }
  */                
                  ans = str.substring(pos + 1,
                            len + pos + 1);
  //                result.push(ans);
                  result.push(<ShowOneBookLink book={ans} />);
              }
          } 
      return (
  //    for (let i = 0; i < result.length(); i++) {
          <div>
              {result}
          </div>
  //    }
      );
  };
  
  export default BookLinks;