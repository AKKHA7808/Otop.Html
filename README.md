# OTOP Web Application
**หนึ่งตำบล หนึ่งผลิตภัณฑ์** (One Tambon One Product)

A web application that displays OTOP (One Tambon One Product) data from Thailand with Google Maps integration.

## Features

- ✅ **JSON Data Retrieval**: Loads OTOP product data from a JSON file
- ✅ **Google Maps Integration**: Shows products on an interactive map with latitude/longitude coordinates  
- ✅ **Product Listings**: Displays detailed product information including location, price, and contact details
- ✅ **Interactive Markers**: Click on products to see location details and coordinates
- ✅ **Responsive Design**: Works on desktop and mobile devices
- ✅ **Graceful Degradation**: Works even without Google Maps API key

## How to Use

### Quick Start
1. Clone this repository
2. Open `index.html` in a web browser or serve it with a local web server
3. Browse OTOP products in the list below the map
4. Click on any product to see its location details

### With Google Maps (Optional)
1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Replace `YOUR_API_KEY` in `index.html` with your actual API key
3. Reload the page to see the interactive map with product markers

### Running with Local Server
```bash
# Using Python
python3 -m http.server 8080

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8080
```

Then open `http://localhost:8080` in your browser.

## Project Structure

```
├── index.html          # Main HTML file
├── app.js             # JavaScript for data loading and map functionality
├── style.css          # CSS styling
├── otop-data.json     # Sample OTOP product data
└── README.md          # This file
```

## Data Format

The OTOP data is stored in `otop-data.json` with the following structure:

```json
{
  "id": 1,
  "name": "Product Name",
  "description": "Product Description", 
  "tambon": "Sub-district",
  "amphoe": "District",
  "province": "Province",
  "category": "Product Category",
  "lat": 16.4322,
  "lng": 102.8236,
  "price": "Price Range",
  "contact": "Contact Information"
}
```

## Technologies Used

- **HTML5** for structure
- **CSS3** for styling with responsive design
- **Vanilla JavaScript** for functionality
- **Google Maps JavaScript API** for map display
- **JSON** for data storage

## Browser Support

- Chrome/Chromium 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

Open source - feel free to use and modify for your projects.
