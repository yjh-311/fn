const myapp = Vue.createApp({
	data() {
		return {
			lightOn: false,
			projects: [],
			selectedProject: null,
			newProject: {
				name: '',
				description: '',
				imageFile: null, // 이미지 파일 저장용
				date_start: '',
				date_end: '',
				projectURL: '',
				tc: '',
				project_background: '',
				Meaning: '',
				sub_title: ''

			},
			message: '',
		};
	},
	mounted() {
		this.loadPortfolio();
	},
	methods: {formatDescription(description) {
			if (!description) {
				return [];
			}
			// ". "와 "\n"을 기준으로 분리
			return description.split(/\n/).filter(item => item.trim() !== '');
		},
		// 파일 선택 시 실행되는 메서드
		onFileChange(event) {
			this.newProject.imageFile = event.target.files[0];
		},
		openModal(project) {
			this.selectedProject = project; // 선택한 프로젝트 설정
		},
		closeModal() {
			this.selectedProject = null; // 선택한 프로젝트 초기화
		},

		openLink(url) {
			window.open(url, '_blank');
		},

		// Firebase Storage와 Realtime Database에 프로젝트 추가
		addProject() {
			// 프로젝트 데이터를 생성
			const projectData = {
				name: this.newProject.name,
				description: this.newProject.description,
				date_start: this.newProject.date_start,
				date_end: this.newProject.date_end,
				projectURL: this.newProject.projectURL,
				technologies: this.newProject.tc,
				background: this.newProject.project_background,
				meaning: this.newProject.Meaning,
				sub_title: this.newProject.sub_title
			};

			// 이미지 파일이 있을 경우
			if (this.newProject.imageFile) {
				const imageName = encodeURIComponent(`${this.newProject.name}_${this.newProject.imageFile.name}`);
				const storageRef = firebase.storage().ref(`images/${imageName}`);
				const uploadTask = storageRef.put(this.newProject.imageFile);

				uploadTask.on(
					'state_changed',
					null,
					(error) => console.error("업로드 오류:", error),
					() => {
						uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
							projectData.imageUrl = downloadURL; // 다운로드 URL 저장
							this.submitProjectData(projectData); // Firebase에 데이터 제출
						});
					}
				);
			} else {
				// 이미지 파일이 없는 경우
				this.submitProjectData(projectData);
			}
		},

		// Firebase에 프로젝트 데이터 제출
		submitProjectData(projectData) {
			$.ajax({
				url: `https://frontend-de63a-default-rtdb.firebaseio.com/projects.json`,
				method: 'POST',
				data: JSON.stringify(projectData),
				success: () => {
					alert("프로젝트가 성공적으로 추가되었습니다!");
					this.message = "프로젝트가 성공적으로 추가되었습니다!";
					this.loadPortfolio();

					// newProject 속성 초기화
					this.newProject = {
						name: '',
						description: '',
						imageFile: null,
						date_start: '',
						date_end: '',
						projectURL: '',
						tc: '',
						project_background: '',
						Meaning: '',
						sub_title: ''
					};

					// 파일 입력 필드 초기화
					this.$refs.fileInput.value = null;
				},
				error: (error) => console.error("추가 중 오류 발생:", error),
			});
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
		transformedTechnologies(technologies) {
      if (technologies) { // technologies가 유효한지 확인
        return technologies.replace(/,/g, ' #');
      }
      return ''; // technologies가 undefined인 경우 빈 문자열 반환
    },

		// 프로젝트 삭제 (이미지 파일도 함께 삭제)
		deleteProject(id) {
			const project = this.projects.find(proj => proj.id === id);
			const projectRef = `https://frontend-de63a-default-rtdb.firebaseio.com/projects/${id}.json`;

			if (project && project.imageUrl) {
				// 이미지가 있는 경우, Firebase Storage에서 이미지 삭제
				const storageRef = firebase.storage().refFromURL(project.imageUrl);
				storageRef.delete().then(() => {
					// 이미지 삭제가 완료된 후, 프로젝트 데이터 삭제
					this.deleteProjectData(projectRef);
				}).catch((error) => {
					console.error("이미지 삭제 중 오류 발생:", error);
					// 이미지 삭제에 실패하더라도 프로젝트 데이터는 삭제
					this.deleteProjectData(projectRef);
				});
			} else {
				// 이미지가 없는 경우, 바로 프로젝트 데이터 삭제
				this.deleteProjectData(projectRef);
			}
		},

		deleteProjectData(projectRef) {
			$.ajax({
				url: projectRef,
				method: 'DELETE',
				success: () => {
					this.loadPortfolio();
					this.message = "프로젝트가 성공적으로 삭제되었습니다!";
				},
				error: (error) => console.error("삭제 중 오류 발생:", error),
			});
		}
	}
});

myapp.mount('#myapp');


//타이핑 효과
var typingBool = false;
var typingIdx = 0;

// 타이핑될 텍스트를 가져온다 
var typingTxt = $(".typing-txt").text();

typingTxt = typingTxt.split(""); // 한글자씩 자른다. 

if (typingBool == false) {
	// 타이핑이 진행되지 않았다면 
	typingBool = true;
	var tyInt = setInterval(typing, 100); // 반복동작 
}

function typing() {
	if (typingIdx < typingTxt.length) {
		// 타이핑될 텍스트 길이만큼 반복 
		$(".typing").append(typingTxt[typingIdx]);
		// 한글자씩 이어준다. 
		typingIdx++;
	} else {
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
