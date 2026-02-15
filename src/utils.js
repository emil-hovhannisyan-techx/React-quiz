// User/localStorage utilities
export function generateId() {
	return (
		Math.random().toString(36).slice(2) + Date.now().toString(36)
	);
}

export function getUsers() {
	const users = localStorage.getItem("quizUsers");
	return users ? JSON.parse(users) : [];
}

export function saveUser(user) {
	const users = getUsers();
	users.push(user);
	localStorage.setItem("quizUsers", JSON.stringify(users));
}

export function getCurrentUser() {
	const user = localStorage.getItem("quizUser");
	return user ? JSON.parse(user) : null;
}

export function setCurrentUser(user) {
	localStorage.setItem("quizUser", JSON.stringify(user));
}

export function removeCurrentUser() {
	localStorage.removeItem("quizUser");
}
