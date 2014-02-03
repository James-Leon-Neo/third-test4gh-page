/*
	Some tricks to tackle some boring and tedious online exams in NKU
	Project Facing NKU's ZiXiuKe
	Build 00045
	By N.J. (Hyperbola)
	2014-01-01
*/

var frmTimer;
var studySecond;
var parentNode;
var fraExam;
var contentDocument;
var contentWindow;
var pageId;
var examId;
var isSpecial;
var isFinal;
var questions;
var raw;
var problemType;
var problemCount;
var problems;
var questionList;

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
	lnkSaveTime.onclick=function(){saveTime();return false;};
}
function restoreTimer()
{
	var timer;
	var timerForm;
	var text;
	var span;
	var stopTimer;
	var hfStartTime;
	var hfEndTime;
	var hfPlanId;
	timer=document.createElement("div");
	timer.id="timer";
	timer.className="timer";
	timer.style.position="relative";
	timer.style.zIndex="100";
	timer.style.backgroundColor="white";
	timerForm=document.createElement("form");
	timerForm.id="timerForm";
	timerForm.method="post";
	text=document.createTextNode("学习时间：");
	span=document.createElement("span");
	stopTimer=document.createElement("a");
	stopTimer.className="stopTimer";
	stopTimer.title="没事常点点哦，点完都能保存已经学习的时间啊！";
	hfStartTime=document.createElement("input");
	hfStartTime.id="hfStartTime";
	hfStartTime.name="hfStartTime";
	hfStartTime.type="hidden";
	hfStartTime.value=fomartDate(startTime);
	hfEndTime=document.createElement("input");
	hfEndTime.id="hfEndTime";
	hfEndTime.name="hfEndTime";
	hfEndTime.type="hidden";
	hfEndTime.value=fomartDate(startTime);
	hfPlanId=document.createElement("input");
	hfPlanId.id="hfPlanId";
	hfPlanId.name="hfPlanId";
	hfPlanId.type="hidden";
	hfPlanId.value=examId;
	timerForm.appendChild(text);
	timerForm.appendChild(span);
	timerForm.appendChild(stopTimer);
	timerForm.appendChild(hfStartTime);
	timerForm.appendChild(hfEndTime);
	timerForm.appendChild(hfPlanId);
	timer.appendChild(timerForm);	
	articleScroll.parentNode.insertBefore(timer,articleScroll);
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
function processPaper()
{
	contentDocument=fraExam?fraExam.contentDocument:document;
	contentWindow=fraExam?fraExam.contentWindow:window;
	questionList=contentDocument.getElementById("ContentPlaceHolder1_QuestionsList");
	if(!questionList)
	{
		return;
	}
	questions=contentDocument.getElementsByTagName("li");
	raw=contentDocument.getElementById("__VIEWSTATE").value;
	problemType=isSpecial?new Array(3,0,0,0):isFinal?new Array(20,10,5,30):new Array(3,2,3,2);
	problemCount=isSpecial?3:isFinal?65:10;
	problems=new Array(problemCount);
	selectable();
	getProblems();
	displayAnswers();
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
	var i;
	var div;
	var ans;
	var pos,rpos;
	var ch;
	var flag;
	var button;
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
				div.innerHTML+="<div>"+ans+"</div>";
				flag=true;
				pos=problems[i].indexOf(boundary,rpos+1);
			}
		}
		rows[i].cells[0].appendChild(div);
	}
	button=document.createElement("input");
	button.type="button";
	button.value="自动完成";
	button.onclick=autoAnswer;
	button.style.marginTop="30px";
	button.style.height="25px";
	questionList.parentNode.insertBefore(button,questionList);
}
function autoAnswer()
{
	var rows;
	var i;
	var inputs;
	var count;
	var div;
	var ans;
	var pos;
	var ch;
	var len;
	var divs;
	var number;
	var j;
	rows=questionList.rows;
	for(i=0;i<problemCount;i++)
	{
		inputs=rows[i].getElementsByTagName("input");
		count=inputs.length;
		div=rows[i].getElementsByTagName("div")[0];
		ans=div.innerHTML;
		if(i<problemType[0])
		{
			pos=ans.indexOf("：");
			ch=ans.charCodeAt(pos+1);
			inputs[count-69+ch].checked=true;
		}
		else if(i<problemType[0]+problemType[1])
		{
			pos=ans.indexOf("：");
			ans=ans.substring(pos+1);
			len=ans.length;
			for(j=0;j<len;j+=2)
			{
				ch=ans.charCodeAt(j);
				inputs[count-69+ch].checked=true;
			}
		}
		else if(i>problemType[0]+problemType[1]+problemType[2]-1)
		{
			pos=ans.indexOf("：");
			ch=ans.charCodeAt(pos+1);
			inputs[count-67+ch].checked=true;
		}
		else
		{
			divs=div.getElementsByTagName("div");
			number=0;
			for(j=0;j<count;j++)
			{
				if(inputs[j].style.display!="none")
				{
					number++;
				}
			}
			if(divs.length==number)
			{
				for(j=0;j<number;j++)
				{
					inputs[count-number+j].value=divs[j].innerHTML;
				}
			}
		}
	}
}
function init()
{
	var pages;
	var exams;
	var regExp;
	var i;
	pages=new Array(1,4,5,7,8,9,10,11,13,14,15,16,18,19,20,21,23,24,25,27,28,29,31,32,33,35,36,37,42,78);
	exams=new Array(45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,77,78);
	regExp=new RegExp(".*[\\/|=](\\d*)$");
	pageId=regExp.exec(window.location.href)[1];
	frmTimer=document.getElementById("timerForm")?document.getElementById("timerForm"):null;
	parentNode=document.getElementById("tab1")?document.getElementById("tab1"):document;
	fraExam=parentNode.getElementsByTagName("iframe")[0]?parentNode.getElementsByTagName("iframe")[0]:null;
	if(pageId<45)
	{
		for(i=0;i<30;i++)
		{
			if(pageId==pages[i])
			{
				examId=exams[i];
				break;
			}
		}
	}
	else
	{
		for(i=0;i<30;i++)
		{
			if(pageId==exams[i])
			{
				pageId=pages[i];
				examId=exams[i];
				break;
			}
		}
	}
	isSpecial=examId=="63"?true:false;
	isFinal=examId=="78"?true:false;
	if(frmTimer&&!isNaN(studySecond)&&studySecond<1200)
	{
		improveTimer();
	}
	else if(!isNaN(studySecond))
	{
		restoreTimer();
	}
	if(fraExam)
	{
		fraExam.onload=processPaper;
	}
	else
	{
		processPaper();
	}
}

init();