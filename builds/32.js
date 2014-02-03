/*
	Some tricks to tackle some boring and tedious online exams in NKU
	Project Facing NKU's ZiXiuKe
	Build 00032
	By N.J. (Hyperbola)
	2013-12-10
*/

var fraExam;
var contentDocument;
var contentWindow;
var qs;
var raw;
var ps;
var ql;
fraExam=document.getElementById("tab1")?document.getElementById("tab1").getElementsByTagName("iframe")[0]:null;
contentDocument=fraExam?fraExam.contentDocument:document;
contentWindow=fraExam?fraExam.contentWindow:window;
qs=contentDocument.getElementsByTagName("li");
raw=contentDocument.getElementById("__VIEWSTATE").value;
ps=new Array(10);
ql=contentDocument.getElementById("ContentPlaceHolder1_QuestionsList");

function base64_decode(input)
{
	var map;
	var e1,e2,e3,e4;
	var d1,d2,d3;
	var output;
	var len;
	var i;
	len=input.length;
	if(len%4)
	{
		return false;
	}
	map="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	output="";
	for(i=0;i<len;i++)
	{
		e1=map.indexOf(input[i]);
		e2=map.indexOf(input[++i]);
		e3=map.indexOf(input[++i]);
		e4=map.indexOf(input[++i]);
		d1=(e1<<2)|(e2>>4);
		d2=((e2&15)<<4)|(e3>>2);
		d3=((e3&3)<<6)|e4;
		output+=String.fromCharCode(d1);
		if(e3!=64)
		{
			output+=String.fromCharCode(d2);
		}
		if(e4!=64)
		{
			output+=String.fromCharCode(d3);
		}
	}
	output=utf8to16(output);
	return output;
}
function utf8to16(input)
{
	var output;
	var len;
	var i;
	var c1,c2,c3;
	var c;
	output="";
	len=input.length;
	for(i=0;i<len;i++)
	{
		c1=input.charCodeAt(i);
		if(c1<128)
		{
			c=c1;
		}
		else if(c1>191&&c1<224)
		{
			c2=input.charCodeAt(++i);
			c=((c1&31)<<6)|(c2&63);
		}
		else
		{
			c2=input.charCodeAt(++i);
			c3=input.charCodeAt(++i);
			c=((c1&15)<<12)|((c2&63)<<6)|(c3&63);
		}
		output+=String.fromCharCode(c);
	}
	return output;
}
function selectable()
{
	for(i in qs)
	{
		q=qs[i];
		q.unselectable="off";
		q.onselectstart=function(){return true;};
		if(q.style)
		{
			q.style.cssText="";
		}
	}
}
function getProblems()
{
	var decoded;
	var start,end;
	var i;
	var keys;
	decoded=base64_decode(raw);
	keys=new Array("单选","单选","多选","多选","填空","填空","填空","判断","判断","判断");
	start=decoded.indexOf("单选");
	for(i=0;i<10;i++)
	{
		end=decoded.indexOf(keys[i],start+1);
		if(end>=0)
		{
			ps[i]=decoded.substring(start,end);
		}
		else
		{
			ps[i]=decoded.substring(start);
		}
		start=end;
	}
}
function displayAnswers()
{
	var rows;
	var boundary;
	var pos,rpos;
	var i;
	var ch;
	var ans;
	var div;
	var flag;
	rows=ql.rows;
	boundary="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	for(i=0;i<10;i++)
	{
		div=document.createElement("div");
		div.style.color="blue";
		div.style.fontWeight="bold";
		div.style.fontSize="16px";
		div.innerHTML="答案：";
		flag=false;
		if(i<3||i>7)
		{
			pos=ps[i].indexOf(boundary);
			ch=ps[i].charCodeAt(pos-1);
			ch=ch&255;
			div.innerHTML+=String.fromCharCode(ch);
		}
		else if(i<5)
		{
			pos=ps[i].indexOf(boundary);
			while(pos>=0)
			{
				ch=ps[i].charCodeAt(pos-1);
				ch=ch&255;
				if(flag)
				{
					div.innerHTML+="，";
				}
				div.innerHTML+=String.fromCharCode(ch);
				flag=true;
				pos=ps[i].indexOf(boundary,pos+1);
			}
		}
		else
		{
			div.innerHTML+="<br />";
			pos=ps[i].indexOf(boundary);
			while(pos>=0)
			{
				rpos=pos;
				ch=ps[i].charCodeAt(--pos);
				while(ch>127)
				{
					ch=ps[i].charCodeAt(--pos);
				}
				ans=ps[i].substring(pos+1,rpos);
				if(flag)
				{
					div.innerHTML+="<br />";
				}
				div.innerHTML+=ans;
				flag=true;
				pos=ps[i].indexOf(boundary,rpos+1);
			}
		}
		rows[i].cells[0].appendChild(div);
	}
}
function init()
{
	contentWindow.startExam(1000);
	selectable();
	getProblems();
	displayAnswers();
}

init();