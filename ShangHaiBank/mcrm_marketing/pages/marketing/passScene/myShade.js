document.querySelector('.myShade')
document.querySelector('.popDiv')

function closeShade() {
	var shade = document.querySelector('.myShade');
	var pop = document.querySelector('.popDiv');
	if(shade){
		shade.style.display="none";
	}
	if(pop){
		pop.style.display="none";
	}
	document.body.style.overflow = 'auto';
}

function openShade() {
	var shade = document.querySelector('.myShade');
	var pop = document.querySelector('.popDiv');
	if(shade){
		shade.style.display="block";
	}
	if(pop){
		pop.style.display="block";
	}
	document.body.style.overflow = 'hidden';
	
}