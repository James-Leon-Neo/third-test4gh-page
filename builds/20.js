/*
	Some tricks to tackle some boring and tedious online exams in NKU
	Project Facing NKU's ZiXiuKe
	Build 00020
	By N.J. (Hyperbola)
	2013-12-09
*/

var fraExam=document.getElementById("tab1").getElementsByTagName("iframe")[0];
var qs=fraExam.contentDocument.getElementsByTagName("li");
fraExam.contentWindow.startExam(1000);
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