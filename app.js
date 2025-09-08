// Global variables
let map;
let otopData = [];
let markers = [];

// Initialize the map
function initMap() {
    // Center the map on Thailand
    const thailandCenter = { lat: 15.8700, lng: 100.9925 };
    
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: thailandCenter,
        mapTypeId: 'roadmap',
        styles: [
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
            },
            {
                featureType: 'landscape',
                elementType: 'geometry',
                stylers: [{ color: '#f5f5f5' }, { lightness: 20 }]
            }
        ]
    });
    
    // Load OTOP data
    loadOtopData();
}

// Load OTOP data from JSON file
async function loadOtopData() {
    try {
        const response = await fetch('otop-data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        otopData = await response.json();
        
        // Update product count
        updateProductCount();
        
        // Display markers on map (only if Google Maps is available)
        if (typeof google !== 'undefined' && map) {
            displayMarkers();
        }
        
        // Always display product list
        displayProductList();
        
    } catch (error) {
        console.error('Error loading OTOP data:', error);
        document.getElementById('product-count').innerHTML = 
            '<span style="color: red;">ไม่สามารถโหลดข้อมูลได้</span>';
    }
}

// Update product count display
function updateProductCount() {
    const countElement = document.getElementById('product-count');
    countElement.textContent = `พบผลิตภัณฑ์ OTOP ทั้งหมด ${otopData.length} รายการ`;
}

// Display markers on the map
function displayMarkers() {
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    
    otopData.forEach(product => {
        const marker = new google.maps.Marker({
            position: { lat: product.lat, lng: product.lng },
            map: map,
            title: product.name,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="18" fill="#667eea" stroke="white" stroke-width="2"/>
                        <circle cx="20" cy="20" r="8" fill="white"/>
                        <text x="20" y="25" text-anchor="middle" fill="#667eea" font-family="Arial" font-size="10" font-weight="bold">OTOP</text>
                    </svg>
                `),
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 20)
            }
        });
        
        // Create info window
        const infoWindow = new google.maps.InfoWindow({
            content: createInfoWindowContent(product)
        });
        
        // Add click listener to marker
        marker.addListener('click', () => {
            // Close all other info windows
            markers.forEach(m => {
                if (m.infoWindow) {
                    m.infoWindow.close();
                }
            });
            
            infoWindow.open(map, marker);
        });
        
        // Store info window reference
        marker.infoWindow = infoWindow;
        markers.push(marker);
    });
}

// Create content for info window
function createInfoWindowContent(product) {
    return `
        <div class="custom-info-window">
            <div class="info-window-title">${product.name}</div>
            <div class="info-window-description">${product.description}</div>
            <div class="info-window-details">
                <strong>ที่อยู่:</strong> ตำบล${product.tambon} อำเภอ${product.amphoe}<br>
                จังหวัด${product.province}<br>
                <strong>ประเภท:</strong> ${product.category}<br>
                <strong>ติดต่อ:</strong> ${product.contact}
            </div>
            <div class="info-window-price">
                <strong>ราคา:</strong> ${product.price}
            </div>
        </div>
    `;
}

// Display product list
function displayProductList() {
    const productsContainer = document.getElementById('products');
    
    if (otopData.length === 0) {
        productsContainer.innerHTML = '<p>ไม่พบข้อมูลผลิตภัณฑ์</p>';
        return;
    }
    
    const productItems = otopData.map(product => `
        <div class="product-item" onclick="focusOnProduct(${product.lat}, ${product.lng}, ${product.id})">
            <div class="product-header">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
            </div>
            <div class="product-description">${product.description}</div>
            <div class="product-location">
                📍 ตำบล${product.tambon} อำเภอ${product.amphoe} จังหวัด${product.province}
            </div>
            <div class="product-price">💰 ${product.price}</div>
            <div class="product-contact">📞 ${product.contact}</div>
        </div>
    `).join('');
    
    productsContainer.innerHTML = productItems;
}

// Focus on a specific product on the map
function focusOnProduct(lat, lng, productId) {
    // If map is not available, just show an alert with location info
    if (typeof google === 'undefined' || !map) {
        const product = otopData.find(p => p.id === productId);
        if (product) {
            alert(`📍 ${product.name}\nที่อยู่: ตำบล${product.tambon} อำเภอ${product.amphoe} จังหวัด${product.province}\nพิกัด: ${lat}, ${lng}`);
        }
        return;
    }
    
    const position = { lat: lat, lng: lng };
    
    // Center map on the product location
    map.setCenter(position);
    map.setZoom(12);
    
    // Find and click the corresponding marker
    const marker = markers.find(m => 
        Math.abs(m.getPosition().lat() - lat) < 0.0001 && 
        Math.abs(m.getPosition().lng() - lng) < 0.0001
    );
    
    if (marker) {
        // Trigger marker click to show info window
        google.maps.event.trigger(marker, 'click');
        
        // Add a slight bounce animation
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => {
            marker.setAnimation(null);
        }, 1500);
    }
}

// Handle map loading errors
window.gm_authFailure = function() {
    document.getElementById('map').innerHTML = 
        '<div style="padding: 20px; text-align: center; color: red;">' +
        'ไม่สามารถโหลด Google Maps ได้<br>' +
        'กรุณาตรวจสอบ API Key หรือการเชื่อมต่ออินเทอร์เน็ต' +
        '</div>';
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Always try to load OTOP data
    loadOtopData();
    
    // If Google Maps API is not loaded, show a message
    if (typeof google === 'undefined') {
        setTimeout(() => {
            if (typeof google === 'undefined') {
                document.getElementById('map').innerHTML = 
                    '<div style="padding: 20px; text-align: center; color: orange; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px;">' +
                    '<h4 style="color: #856404; margin-bottom: 10px;">🗺️ แผนที่ไม่พร้อมใช้งาน</h4>' +
                    'กรุณาเพิ่ม Google Maps API Key ในไฟล์ index.html<br>' +
                    'หรือตรวจสอบการเชื่อมต่ออินเทอร์เน็ต<br><br>' +
                    '<small>ข้อมูล OTOP ยังสามารถดูได้ในรายการด้านล่าง</small>' +
                    '</div>';
            }
        }, 1000);
    }
});