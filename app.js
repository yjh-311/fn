const myapp = Vue.createApp({
    data() {
        return {
            lightOn: false,
            projects: [],
            newProject: {
                name: '',
                description: '',
                imageFile: null, // 이미지 파일 저장용
                date_start: '',
                date_end: ''
            },
            message: '',
        };
    },
    mounted() {
        this.loadPortfolio();
    },
    methods: {
        // 파일 선택 시 실행되는 메서드
        onFileChange(event) {
            this.newProject.imageFile = event.target.files[0];
        },

        // Firebase Storage와 Realtime Database에 프로젝트 추가
        addProject() {
            if (this.newProject.imageFile) {
                const storageRef = firebase.storage().ref(`images/${this.newProject.imageFile.name}`);
                const uploadTask = storageRef.put(this.newProject.imageFile);

                uploadTask.on(
                    'state_changed',
                    null,
                    (error) => console.error("업로드 오류:", error),
                    () => {
                        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                            const projectData = {
                                name: this.newProject.name,
                                description: this.newProject.description,
                                imageUrl: downloadURL, // 다운로드 URL 저장
                                date_start: this.newProject.date_start,
                                date_end: this.newProject.date_end
                            };

                            $.ajax({
                                url: `https://frontend-de63a-default-rtdb.firebaseio.com/projects.json`,
                                method: 'POST',
                                data: JSON.stringify(projectData),
                                success: () => {
                                    this.message = "프로젝트가 성공적으로 추가되었습니다!";
                                    this.loadPortfolio();
                                    this.newProject = { name: '', description: '', imageFile: null, date_start: '', date_end: '' };
                                },
                                error: (error) => console.error("추가 중 오류 발생:", error),
                            });
                        });
                    }
                );
            }
        },

        // 프로젝트 불러오기
        loadPortfolio() {
            $.ajax({
                url: `https://frontend-de63a-default-rtdb.firebaseio.com/projects.json`,
                method: 'GET',
                success: (data) => {
                    this.projects = Object.keys(data || {}).map(id => ({ id, ...data[id] }));
                },
                error: (error) => console.error("불러오기 중 오류 발생:", error),
            });
        },

        // 프로젝트 삭제 (이미지 파일도 함께 삭제)
        deleteProject(id) {
            const project = this.projects.find(proj => proj.id === id);
            if (project && project.imageUrl) {
                const storageRef = firebase.storage().refFromURL(project.imageUrl);
                storageRef.delete().then(() => {
                    $.ajax({
                        url: `https://frontend-de63a-default-rtdb.firebaseio.com/projects/${id}.json`,
                        method: 'DELETE',
                        success: () => {
                            this.loadPortfolio();
                            this.message = "프로젝트가 성공적으로 삭제되었습니다!";
                        },
                        error: (error) => console.error("삭제 중 오류 발생:", error),
                    });
                }).catch((error) => console.error("이미지 삭제 중 오류 발생:", error));
            }
        }
    }
});

myapp.mount('#myapp');


//타이핑 효과
var typingBool = false; 
var typingIdx=0; 

// 타이핑될 텍스트를 가져온다 
var typingTxt = $(".typing-txt").text(); 

typingTxt=typingTxt.split(""); // 한글자씩 자른다. 

if(typingBool==false){ 
  // 타이핑이 진행되지 않았다면 
   typingBool=true;     
   var tyInt = setInterval(typing,100); // 반복동작 
} 
     
function typing(){ 
  if(typingIdx<typingTxt.length){ 
    // 타이핑될 텍스트 길이만큼 반복 
    $(".typing").append(typingTxt[typingIdx]);
    // 한글자씩 이어준다. 
    typingIdx++; 
   } else{ 
     //끝나면 반복종료 
    clearInterval(tyInt); 
   } 
}  

//네비바 스크롤
// 부드러운 스크롤 기능을 하는 함수
function scrollToSection(event, sectionId) {
    event.preventDefault();
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: "smooth" });
}


//이미지
 document.getElementById('image').addEventListener('change', function() {
            if (this.files && this.files[0]) {
                alert("이미지가 선택되었습니다: " + this.files[0].name);
            }
        });
