﻿/*
	Some tricks to tackle some boring and tedious online exams in NKU
	Project Facing NKU's ZiXiuKe
	Build 00038
	By N.J. (Hyperbola)
	2013-12-12
*/

var regExp;
var pageId;
var isFinal;
var frmTimer;
var fraExam;
var contentDocument;
var contentWindow;
var questions;
var raw;
var problemType;
var problemCount;
var problems;
var questionList;

regExp=new RegExp(".*[\\/|=](\\d*)$");
pageId=regExp.exec(window.location.href)[1];
isFinal=pageId=="78"?true:false;
frmTimer=document.getElementById("timerForm")?document.getElementById("timerForm"):null;
fraExam=document.getElementById("tab1")?document.getElementById("tab1").getElementsByTagName("iframe")[0]:null;
fraExam=!fraExam&&isFinal?document.getElementsByTagName("iframe")[0]:fraExam;
contentDocument=fraExam?fraExam.contentDocument:document;
contentWindow=fraExam?fraExam.contentWindow:window;
questions=contentDocument.getElementsByTagName("li");
raw=contentDocument.getElementById("__VIEWSTATE")?contentDocument.getElementById("__VIEWSTATE").value:null;
problemType=isFinal?new Array(20,10,5,30):new Array(3,2,3,2);
problemCount=isFinal?65:10;
problems=new Array(problemCount);
questionList=contentDocument.getElementById("ContentPlaceHolder1_QuestionsList");

function improveTimer()
{
	var startTime;
	var currentId;
	var planId;
	var content;
	var lnkSaveTime;
	startTime=$("#hfStartTime")[0].value;
	currentId=parseInt($("#hfPlanID")[0].value);
	for(planId=currentId;planId<73;planId++)
	{
		content="hfStartTime="+startTime+"&hfEndTime="+startTime+"&hfPlanID="+planId;
		$.post("",content);
	}
	planId=77;
	content="hfStartTime="+startTime+"&hfEndTime="+startTime+"&hfPlanID="+planId;
	$.post("",content);
	lnkSaveTime=frmTimer.getElementsByTagName("a")[0];
	lnkSaveTime.href="";
	lnkSaveTime.onclick=function(){saveTime();return false;};
}
function saveTime()
{
	var startTime;
	var endTime;
	var currentId;
	var planId;
	var content;
	startTime=$("#hfStartTime")[0].value;
	endTime=fomartDate(new Date());
	currentId=parseInt($("#hfPlanID")[0].value);
	for(planId=currentId;planId<73;planId++)
	{
		content="hfStartTime="+startTime+"&hfEndTime="+endTime+"&hfPlanID="+planId;
		$.post("",content);
	}
	planId=77;
	content="hfStartTime="+startTime+"&hfEndTime="+endTime+"&hfPlanID="+planId;
	$.post("",content);
}
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
	var i;
	var question;
	for(i in questions)
	{
		question=questions[i];
		question.unselectable="off";
		question.onselectstart=function(){return true;};
		if(question.style)
		{
			question.style.cssText="";
		}
	}
}
function getProblems()
{
	var decoded;
	var start,end;
	var i;
	var j;
	var keys;
	decoded=base64_decode(raw);
	keys=new Array("单选dd","多选dd","填空dd","判断dd");
	start=decoded.indexOf("单选dd");
	for(i=0;i<problemCount;i++)
	{
		if(i<problemType[0]-1)
		{
			j=0;
		}
		else if(i<problemType[0]+problemType[1]-1)
		{
			j=1;
		}
		else if(i<problemType[0]+problemType[1]+problemType[2]-1)
		{
			j=2;
		}
		else
		{
			j=3;
		}
		end=decoded.indexOf(keys[j],start+1);
		if(end>=0)
		{
			problems[i]=decoded.substring(start,end);
		}
		else
		{
			problems[i]=decoded.substring(start);
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
	rows=questionList.rows;
	boundary="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	for(i=0;i<problemCount;i++)
	{
		div=document.createElement("div");
		div.style.color="blue";
		div.style.fontWeight="bold";
		div.style.fontSize="16px";
		div.innerHTML="答案：";
		flag=false;
		if(i<problemType[0]||i>problemType[0]+problemType[1]+problemType[2]-1)
		{
			pos=problems[i].indexOf(boundary);
			ch=problems[i].charCodeAt(pos-1);
			ch=ch&255;
			div.innerHTML+=String.fromCharCode(ch);
		}
		else if(i<problemType[0]+problemType[1])
		{
			pos=problems[i].indexOf(boundary);
			while(pos>=0)
			{
				ch=problems[i].charCodeAt(pos-1);
				ch=ch&255;
				if(flag)
				{
					div.innerHTML+="，";
				}
				div.innerHTML+=String.fromCharCode(ch);
				flag=true;
				pos=problems[i].indexOf(boundary,pos+1);
			}
		}
		else
		{
			div.innerHTML+="<br />";
			pos=problems[i].indexOf(boundary);
			while(pos>=0)
			{
				rpos=pos;
				ch=problems[i].charCodeAt(--pos);
				while(ch>127)
				{
					ch=problems[i].charCodeAt(--pos);
				}
				ans=problems[i].substring(pos+1,rpos);
				if(flag)
				{
					div.innerHTML+="<br />";
				}
				div.innerHTML+=ans;
				flag=true;
				pos=problems[i].indexOf(boundary,rpos+1);
			}
		}
		rows[i].cells[0].appendChild(div);
	}
}
function init()
{
	if(frmTimer)
	{
		improveTimer();
	}
	if(raw&&questionList)
	{
		contentWindow.startExam(1000);
		selectable();
		getProblems();
		displayAnswers();
	}
}

init();