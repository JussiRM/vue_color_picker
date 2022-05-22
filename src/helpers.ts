export function generateQuiteRandomString() : string {
	return Math.random().toString().split(".")[1] 
		+ "-" 
		+ Date.now().valueOf().toString();
}

export function preventPercentageOutOfBounds(value:number) : number {
	if (value > 100) {
		return 100;
	}
	if (value < 0) {
		return 0;
	}
	return value;
}