(function(){
  const startScreen=document.getElementById('start-screen');
  const quizScreen=document.getElementById('quiz-screen');
  const resultScreen=document.getElementById('result-screen');
  const startBtn=document.getElementById('startBtn');
  const nextBtn=document.getElementById('nextBtn');
  const submitBtn=document.getElementById('submitBtn');
  const retryBtn=document.getElementById('retryBtn');
  const printBtn=document.getElementById('printBtn');
  const qText=document.getElementById('questionText');
  const choicesWrap=document.getElementById('choices');
  const progressBar=document.getElementById('progressBar');
  const qCounter=document.getElementById('qCounter');
  const scoreLine=document.getElementById('scoreLine');
  const messageLine=document.getElementById('messageLine');
  const review=document.getElementById('review');
  const nameInput=document.getElementById('studentName');
  const dateInput=document.getElementById('testDate');
  const resultTitle=document.getElementById('resultTitle');

  let questions=[],index=0,score=0,selected=null,answersLog=[],studentName='';

  function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  nameInput.addEventListener('input',()=>{startBtn.disabled=!nameInput.value.trim();});

  startBtn.addEventListener('click',()=>{
    studentName=nameInput.value.trim();
    questions=shuffle([...window.QUESTIONS]);
    index=0;score=0;answersLog=[];
    startScreen.classList.add('hidden');quizScreen.classList.remove('hidden');
    renderQ();updateProgress();
  });

  function renderQ(){
    nextBtn.classList.add('hidden');submitBtn.disabled=true;
    const q=questions[index];
    qText.textContent=q.q;qCounter.textContent=`Question ${index+1} of ${questions.length}`;
    choicesWrap.innerHTML='';
    q.choices.forEach((t,i)=>{
      const b=document.createElement('button');
      b.className='choice';b.innerHTML=`<strong>${String.fromCharCode(65+i)}.</strong> ${t}`;
      b.addEventListener('click',()=>selectChoice(b,i));
      choicesWrap.appendChild(b);
    });
  }

  function selectChoice(btn,i){
    [...choicesWrap.children].forEach(c=>c.classList.remove('selected'));
    btn.classList.add('selected');selected=i;submitBtn.disabled=false;
  }

  submitBtn.addEventListener('click',()=>{
    if(selected==null)return;
    const q=questions[index];const correct=selected===q.answer;
    answersLog.push({q:q.q,selectedIdx:selected,correctIdx:q.answer,options:q.choices});
    if(correct)score++;
    [...choicesWrap.children].forEach((b,i)=>{
      if(i===q.answer)b.classList.add('correct');
      else if(i===selected&&i!==q.answer)b.classList.add('incorrect');
      b.disabled=true;
    });
    submitBtn.disabled=true;nextBtn.classList.remove('hidden');
    nextBtn.textContent=index===questions.length-1?'Finish':'Next';
  });

  nextBtn.addEventListener('click',()=>{
    index++;selected=null;
    if(index<questions.length){renderQ();updateProgress();}
    else finish();
  });

  function updateProgress(){
    const pct=Math.round((index/questions.length)*100);
    progressBar.style.width=pct+'%';
  }

  function finish(){
    quizScreen.classList.add('hidden');resultScreen.classList.remove('hidden');
    const total=questions.length;const pct=Math.round((score/total)*100);
    resultTitle.textContent=`Results for ${studentName}`;
    const dateVal=dateInput.value?` on ${dateInput.value}`:'';
    scoreLine.textContent=`Score: ${score}/${total} • ${pct}%${dateVal}`;
    let msg='Nice effort — keep studying!';
    if(pct>=90)msg='Outstanding — science star!';else if(pct>=80)msg='Great job — you know your states of matter!';else if(pct>=70)msg='Good work — review a few ideas.';
    messageLine.textContent=msg;
    if(pct>=80)launchConfetti();
    review.innerHTML='';answersLog.forEach((r,idx)=>{
      const d=document.createElement('div');
      const correctText=r.options[r.correctIdx];const selectedText=r.selectedIdx!=null?r.options[r.selectedIdx]:'—';const good=r.selectedIdx===r.correctIdx;
      d.className='review-item';
      d.innerHTML=`<div><strong>Q${idx+1}.</strong> ${r.q}</div><div>Your answer: ${selectedText}</div><div>Correct: ${correctText}</div>`;
      review.appendChild(d);
    });
  }

  function launchConfetti(){
    const c=document.getElementById('confetti');const ctx=c.getContext('2d');
    const W=c.width=c.offsetWidth=c.parentElement.clientWidth-32;const H=c.height=180;const N=100;const parts=[];
    for(let i=0;i<N;i++)parts.push({x:Math.random()*W,y:Math.random()*-H,r:2+Math.random()*3,vx:-1+Math.random()*2,vy:2+Math.random()*2,a:Math.random()*Math.PI*2});
    let f=0;function tick(){ctx.clearRect(0,0,W,H);parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.a+=0.05;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);ctx.fillStyle=`hsl(${(p.x/W)*360},90%,60%)`;ctx.fillRect(-p.r,-p.r,p.r*2,p.r*2);ctx.restore();});f++;if(f<200)requestAnimationFrame(tick);}tick();
  }
  retryBtn.addEventListener('click',()=>{resultScreen.classList.add('hidden');startScreen.classList.remove('hidden');});
  printBtn.addEventListener('click',()=>window.print());
})();