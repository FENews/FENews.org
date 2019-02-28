
## Understanding Repaint and Reflow in JavaScript
## 了解JavaScript中的重绘和回流

Recently, while researching what makes React’s virtual DOM so fast, I realized how little are we aware about javascript performance. So I’m writing this article to help raise the awareness about Repaint and Reflow and JavaScript performance in general.”

最近研究React虚拟Dom为什么这么快的原因时，发现自己对js性能了解甚少。因此决定写这篇文章来帮助大家提高对重绘和回流以及js性能的认识。



![](https://cdn-images-1.medium.com/max/2000/1*gI2j-AlZJohyQqK8skdjjw.png)

## Before we dig deeper, do we know how a browser works?

## 深入挖掘之前，先回顾下浏览器的工作原理

A picture is worth a thousand words. So, let’s have a high-level view of how a browser works!
一张图胜过千言万语。那么让我们高度理解浏览器的原理。

![](https://cdn-images-1.medium.com/max/2000/1*lAUWhHx6CdF_OkMC3YkAHw.png)

**hmm… what’s “browser engine” and “rendering engine”?**
**嗯... 什么是browser engin 和 rendering engine**

The primary job of a browser engine is to transform HTML documents and other resources of a web page into an interactive visual representation on a user’s device.
Besides “browser engine”, two other terms are in common use regarding related concepts: “layout engine” and “rendering engine”. In theory, layout and rendering (or “painting”) could be handled by separate engines. In practice, however, they are tightly coupled and rarely considered separately.

浏览器引擎主要工作是将html文档和其他web页面资源转换为用户设备上可视化交换表示。
除了浏览器引擎之外，另外两个相关概念的术语是：布局引擎和渲染引擎。理论上，布局和渲染或者绘制可以分开由单独的引擎处理。然而，在实践中，它们是紧密耦合的，很少单独考虑。

## let’s understand how browsers draw a user interface on the screen.
## 让我们了解浏览器如何在屏幕上绘制用户界面

When you hit enter on some link or URL browser make an HTTP request to that page and the corresponding serv provides (often) HTML document in response. (a **hell** of a **lot** of [things](https://cheapsslsecurity.com/blog/what-is-ssl-tls-handshake-understand-the-process-in-just-3-minutes/) happen in between)
当你在浏览器中输入url，点击回车时，向该url发出http请求，并且它的服务器响应
HTML文档（在这个过程中有很多事情发生，可以[查看](https://cheapsslsecurity.com/blog/what-is-ssl-tls-handshake-understand-the-process-in-just-3-minutes/)）


![Step by step processing](https://cdn-images-1.medium.com/max/2000/1*_alTfrxmTCP1mInn4QEOnA.jpeg)

* The browser parses out the HTML source code and constructs a **DOM tree **a data representation where every HTML tag has a corresponding node in the tree and the text chunks between tags get a text node representation too. The root node in the DOM tree is the documentElement (the <html> tag)

* The browser parses the CSS code, makes sense of it. The styling information *cascades*: the basic rules are in the User Agent stylesheets (the browser defaults), then there could be user stylesheets, author (as in author of the page) stylesheets - external, imported, inline, and finally styles that are coded into the style attributes of the HTML tags

* Then comes the interesting part — constructing a **render tree**. The render tree is sort of like the DOM tree, but doesn’t match it exactly. The render tree knows about styles, so if you’re hiding a div with display: none, it won't be represented in the render tree. Same for the other invisible elements, like head and everything in it. On the other hand, there might be DOM elements that are represented with more than one node in the render tree - like text nodes for example where every line in a <p> needs a render node. A node in the render tree is called a *frame*, or a *box* (as in a CSS box, according to [the box model](http://www.w3.org/TR/CSS2/box.html#box-dimensions)). Each of these nodes has the CSS box properties - width, height, border, margin, etc

* Once the render tree is constructed, the browser can **paint** (draw) the render tree nodes on the screen

Here is a snapshot of how browser draws user interface on screen.

 <iframe src="https://medium.com/media/8f1e045b2bfe590b62c8238a1f76feb5" frameborder=0></iframe>

It happens in the fraction of seconds that we don’t even notice that all this happened.

**Look closely.**
How browser drawing layout and trying to detect root element, siblings and it’s child element as node comes and rearranging it’s layout accordingly.

Let’s take one example

    <html>
    <head>
      <title>Repaint And Reflow</title>
    </head>
    <body>
        
      <p>
        <strong>How's The Josh?</strong>
        <strong><b> High Sir...</b></strong>
      </p>
      
      <div style="display: none">
        Nothing to display
      </div>
      
      <div><img src="..." /></div>
      ...
     
    </body>
    </html>

*The DOM tree* that represents this HTML document basically has one node for each tag and one text node for each piece of text between nodes (for simplicity let’s ignore the fact that whitespace is text nodes too) :

    documentElement (html)
        head
            title
        body
            p

                strong
                    [text node]

            p
                strong
                    b
                        [text node]    		
            div 
                [text node]
    		
            div
                img
    		
            ...

The *render tree* would be the visual part of the DOM tree. It is missing some stuff — the head and the hidden div, but it has additional nodes (aka frames, aka boxes) for the lines of text.

    root (RenderView)
        body
            p
                line 1
    	    line 2
    	    line 3
    	    ...
    	    
    	div
    	    img
    	    
    	...

The root node of the render tree is the frame (the box) that contains all other elements. You can think of it as being the inner part of the browser window, as this is the restricted area where the page could spread. Technically WebKit calls the root node RenderView and it corresponds to the CSS [initial containing block](http://www.w3.org/TR/CSS21/visudet.html#containing-block-details), which is basically the viewport rectangle from the top of the page (0, 0) to (window.innerWidth, window.innerHeight)

Figuring out what and how exactly to display on the screen involves a recursive walk down (a flow) through the render tree.

## Repaint and Reflow

There’s always at least one initial page layout together with a paint (unless, of course you prefer your pages blank :)). After that, changing the input information which was used to construct the render tree may result in one or both of these:

 1. parts of the render tree (or the whole tree) will need to be revalidated and the node dimensions recalculated. This is called a **reflow**, or layout, or layouting. Note that there’s at least one reflow — the initial layout of the page

 2. parts of the screen will need to be updated, either because of changes in geometric properties of a node or because of stylistic change, such as changing the background color. This screen update is called a **repaint**, or a redraw.

Repaints and reflows can be expensive, they can hurt the user experience, and make the UI appear sluggish

**Repaint**
As the name suggests repaint is nothing but the repainting element on the screen as the skin of element change which affects the visibility of an element but do not affects layout.
Example.
1. Changing visibility of an element.
2. Changing outline of the element.
3. Changing background.
Would trigger a repaint.

According to Opera, the repaint is an expensive operation as it forces the browser to verify/check visibility of all other dom nodes.

**Reflow
**Reflow means re-calculating the positions and geometries of elements in the document, for the purpose of re-rendering part or all of the document. Because reflow is a user-blocking operation in the browser, it is useful for developers to understand how to improve reflow time and also to understand the effects of various document properties (DOM depth, CSS rule efficiency, different types of style changes) on reflow time. Sometimes reflowing a single element in the document may require reflowing its parent elements and also any elements which follow it.

## Virtual DOM VS Real DOM

Every time the DOM changes browser need to recalculate the CSS, do layout and repaint web page. This is what takes time in real dom.

To minimize this time Ember use key/value observation technique and Angular uses dirty checking. Using this technique they can only update changed dom node or the node which are marked as dirty in case of Angular.

If this was not the case then you are not able to see new email as soon as it comes while writing a new email in Gmail.

But, browser are becoming smart enough nowadays they are trying to shorten the time it takes to repaint the screen. The biggest thing that can be done is to minimize and batch the DOM changes that make repaints.

The strategy of reducing and baching DOM changes taken to another level of abstraction is the idea behind React’s Virtual DOM.

## What makes React’s virtual DOM so fast?

React doesn’t really do anything new. It’s just a strategic move. What it does is It stores a replica of real DOM in memory. When you modify the DOM, it first applies these changes to the in-memory DOM. Then, using it’s diffing algorithm, figures out what has really changed.

Finally, it batches the changes and call applies them on real-dom in one go. Thus, minimizing the re-flow and re-paint.

Interested in reading more on that? Well, that’s a topic for another post?

*If you like it, please leave a comment below — it encourages me to write more.
If you didn’t like it, still drop a comment — explaining how can we improve.*

![](https://cdn-images-1.medium.com/max/4000/1*f2IVAl0TbsfES9cFGYr40g.png)

📝 Read this story later in [Journal](https://usejournal.com/?utm_source=medium.com&utm_medium=noteworthy_blog&utm_campaign=guest_post_read_later_text).

🗞 Wake up every Sunday morning to the week’s most noteworthy Tech stories, opinions, and news waiting in your inbox: [Get the noteworthy newsletter >](https://usejournal.com/newsletter/?utm_source=medium.com&utm_medium=noteworthy_blog&utm_campaign=guest_post_text)
