let restaurant;
var map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
	fetchRestaurantFromURL((error, restaurant) => {
		if (error) { // Got an error!
			console.error(error);
		} else {
			self.map = new google.maps.Map(document.getElementById('map'), {
				zoom: 16,
				center: restaurant.latlng,
				scrollwheel: false
			});
			fillBreadcrumb();
			DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
		}
	});
};

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
	if (self.restaurant) { // restaurant already fetched!
		callback(null, self.restaurant);
		return;
	}
	const id = getParameterByName('id');
	if (!id) { // no id found in URL
		error = 'No restaurant id in URL';
		callback(error, null);
	} else {
		DBHelper.fetchRestaurantById(id, (error, restaurant) => {
			self.restaurant = restaurant;
			if (!restaurant) {
				console.error(error);
				return;
			}
			fillRestaurantHTML();
			callback(null, restaurant);
		});
	}
};

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
	const name = document.getElementById('restaurant-name');
	name.setAttribute('tabindex', '0');
	name.setAttribute('aria-label', 'restaurant name, ' + restaurant.name);
	name.innerHTML = restaurant.name;

	const address = document.getElementById('restaurant-address');
	address.setAttribute('tabindex', '0');
	address.setAttribute('aria-label', 'address, ' + restaurant.address);
	address.innerHTML = restaurant.address;

	const image = document.getElementById('restaurant-img');
	image.setAttribute('alt', `Image from the restaurant '${restaurant.name}`);
	image.className = 'restaurant-img';
	image.src = DBHelper.imageUrlForRestaurant(restaurant);

	const cuisine = document.getElementById('restaurant-cuisine');
	cuisine.setAttribute('tabindex', '0');
	cuisine.setAttribute('aria-label', 'cuisine, ' + restaurant.cuisine_type);
	cuisine.innerHTML = restaurant.cuisine_type;

	// fill operating hours
	if (restaurant.operating_hours) {
		fillRestaurantHoursHTML();
	}
	// fill reviews
	fillReviewsHTML();
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
	const hours = document.getElementById('restaurant-hours');
	hours.setAttribute('aria-label', 'opening hours,');
	hours.setAttribute('tabindex', '0');
	for (let key in operatingHours) {
		const row = document.createElement('tr');

		const day = document.createElement('td');
		day.setAttribute('tabindex', 0);
		day.innerHTML = key;
		row.appendChild(day);

		const time = document.createElement('td');
		time.setAttribute('tabindex', 0);
		time.innerHTML = operatingHours[key];
		row.appendChild(time);

		hours.appendChild(row);
	}
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
	const container = document.getElementById('reviews-container');
	const title = document.createElement('h2');
	title.setAttribute('tabindex', '0');
	// title.setAttribuet('aria-label', )
	title.innerHTML = 'Reviews';
	container.appendChild(title);

	if (!reviews) {
		const noReviews = document.createElement('p');
		noReviews.setAttribute('tabinedx', '0');
		noReviews.innerHTML = 'No reviews yet!';
		container.appendChild(noReviews);
		return;
	}
	const ul = document.getElementById('reviews-list');
	reviews.forEach(review => {
		ul.appendChild(createReviewHTML(review));
	});
	container.appendChild(ul);
};

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
	const li = document.createElement('li');

	const div = document.createElement('div');
	div.classList.add('review-header');

	const name = document.createElement('p');
	name.classList.add('review-name');
	name.setAttribute('tabindex', '0');
	name.setAttribute('aria-label', 'name of reviewer, ' + review.name);
	name.innerHTML = review.name;
	div.appendChild(name);
  
	const date = document.createElement('p');
	date.classList.add('review-date');
	date.setAttribute('tabindex', '0');
	date.setAttribute('aria-label', 'date, ' + review.date);
	date.innerHTML = review.date;
	div.appendChild(date);

	li.appendChild(div);

	const rating = document.createElement('p');
	rating.classList.add('review-rating');
	rating.setAttribute('tabindex', '0');
	rating.setAttribute('aria-label', `Rating, ${review.rating}`);
	rating.innerHTML = `Rating: ${review.rating}`;
	li.appendChild(rating);

	const comments = document.createElement('p');
	comments.classList.add('review-comments');
	comments.setAttribute('tabindex', '0');
	comments.setAttribute('aria-label', `Comments, ${review.comments}`);
  
	comments.innerHTML = review.comments;
	li.appendChild(comments);

	return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
	const breadcrumb = document.getElementById('breadcrumb');
	const li = document.createElement('li');
	li.innerHTML = restaurant.name;
	breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
	if (!url)
		url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
		results = regex.exec(url);
	if (!results)
		return null;
	if (!results[2])
		return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
