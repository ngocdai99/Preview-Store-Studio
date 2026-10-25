// Store Preview Studio · Google Play Feature Graphic
// Feature Graphic File Upload & Drag-and-Drop
$('featureUp').onclick=()=>{if(typeof canUpload === 'function' && !canUpload(1000)) return; $('featureFile').click();};
$('featureFile').onchange=e=>{
  const f=e.target.files[0];if(!f)return;
  readFile(f,d=>{
    FEATURE_GRAPHIC=d;
    renderFeature();
    saveState();
    showToast('Feature graphic updated! (1,024 × 500 px)','🖼');
  });
  e.target.value='';
};
const featureDropZone = $('featureDropZone');
featureDropZone.addEventListener('dragover',e=>{e.preventDefault();featureDropZone.classList.add('drag-over')});
featureDropZone.addEventListener('dragleave',()=>{featureDropZone.classList.remove('drag-over')});
featureDropZone.addEventListener('drop',e=>{
  e.preventDefault();featureDropZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if(file && file.type.startsWith('image/')){
    readFile(file,d=>{
      FEATURE_GRAPHIC=d;
      renderFeature();
      saveState();
      showToast('Feature graphic dropped & applied! (1,024 × 500 px)','🖼');
    });
  }
});


// Feature Graphic Info Popover Controller
initInfoPopover("featureInfoBtn", "featureInfoPop", "featureInfoClose", "google");
