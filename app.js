const myapp = Vue.createApp({
    data() {
        return {
            projects: [],
            newProject: {
                name: '',
                description: '',
                link: '',
                date_start: '',
                date_end: ''
            },
            message: ''
        };
    },
    mounted() {
        this.loadPortfolio();
    },
    methods: {
        // Firebase에 프로젝트 추가
        addProject() {
            const projectData = {
                name: this.newProject.name,
                description: this.newProject.description,
                link: this.newProject.link,
                date_start: this.newProject.date_start,
                date_end: this.newProject.date_end
            };

            $.ajax({
                url: `https://frontend-de63a.firebaseio.com/projects.json`,
                method: 'POST',
                data: JSON.stringify(projectData),
                success: () => {
                    this.message = "프로젝트가 성공적으로 추가되었습니다!";
                    this.loadPortfolio(); // 새로 추가한 프로젝트 불러오기
                    this.newProject = { name: '', description: '', link: '', date_start: '', date_end: '' }; // 폼 초기화
                },
                error: (error) => {
                    console.error("추가 중 오류 발생:", error);
                }
            });
        },

        // Firebase에서 프로젝트 불러오기
        loadPortfolio() {
            $.ajax({
                url: `https://frontend-de63a.firebaseio.com/projects.json`,
                method: 'GET',
                success: (data) => {
                    this.projects = Object.keys(data || {}).map(id => ({ id, ...data[id] }));
                },
                error: (error) => {
                    console.error("불러오기 중 오류 발생:", error);
                }
            });
        },

        // Firebase에서 프로젝트 삭제
        deleteProject(id) {
            $.ajax({
                url: `https://frontend-de63a.firebaseio.com/projects/${id}.json`,
                method: 'DELETE',
                success: () => {
                    this.loadPortfolio(); // 삭제 후 업데이트
                    this.message = "프로젝트가 성공적으로 삭제되었습니다!";
                },
                error: (error) => {
                    console.error("삭제 중 오류 발생:", error);
                }
            });
        }
    }
});

app.mount('#myapp');


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
