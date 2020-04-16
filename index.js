const NAME = 'AB-TEST'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
const cookie = request.headers.get('cookie')

let originalResponse = await fetch(new URL('https://cfw-takehome.developers.workers.dev/api/variants'));
let originalBody = await originalResponse.json();           
let jsonData = originalBody.variants;
     if (cookie && cookie.includes(`${NAME}=zero`)) {
       let response =  await fetch(jsonData[0])
       return rewriter.transform(response)
    } else if (cookie && cookie.includes(`${NAME}=one`)) {
       let response =  await fetch(jsonData[1])
       return rewriter2.transform(response)
    } else{
     if (Math.random() < 0.5){
        let response = await fetch(jsonData[0])
        response = new Response(response.body,response)
        response.headers.append('Set-Cookie', `${NAME}=zero`)
        return rewriter.transform(response)
     }else{
      let response = await fetch(jsonData[1])
      response = new Response(response.body,response)
      response.headers.append('Set-Cookie', `${NAME}=one`)
      return rewriter2.transform(response)
     }
    }
}

class AttributeRewriter {
  constructor(attributeName,old_val,new_val) {
    this.attributeName = attributeName
    this.old_val = old_val
    this.new_val = new_val
  }

  element(element) {
    const attribute = element.getAttribute(this.attributeName)
    //  console.log("attribute:::",attribute);
    if (attribute) {
      element.setAttribute(
        this.attributeName,
        attribute.replace(this.old_val, this.new_val),
      )
    }
  }
}

const rewriter = new HTMLRewriter()
.on('a#url', new AttributeRewriter('href','https://cloudflare.com','https://google.com'))
.on('title',{element(element){ element.setInnerContent('Cloudflare 1')}})
.on('a#url', {element(element){ element.setInnerContent('Go to google.com')}})
.on('h1#title',{element(element){ element.setInnerContent('Cloudflare 1')}})
.on('p#description',{element(element){ element.setInnerContent('Developed by Sakshi Mahendru. Thankyou for visting us!!')}})


const rewriter2 = new HTMLRewriter()
.on('a#url', new AttributeRewriter('href','https://cloudflare.com','https://google.com'))
.on('title',{element(element){ element.setInnerContent('Cloudflare 2')}})
.on('a#url', {element(element){ element.setInnerContent('Go to google.com')}})
.on('h1#title',{element(element){ element.setInnerContent('Cloudflare 2')}})
.on('p#description',{element(element){ element.setInnerContent('Developed by Sakshi Mahendru. Have a great day!!')}})



