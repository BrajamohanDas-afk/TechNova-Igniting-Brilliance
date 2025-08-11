from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
from PIL import Image
import io
import tensorflow as tf
from typing import Dict, List, Optional
import uvicorn
import logging
from datetime import datetime
import base64

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Billboard Detection AI Service", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BillboardDetector:
    def __init__(self):
        """Initialize the billboard detection system"""
        self.model = None
        logger.info("Billboard detector initialized")
        
    def detect_billboards(self, image: np.ndarray) -> List[Dict]:
        """Detect billboards in the image using computer vision"""
        try:
            # Convert to grayscale for edge detection
            gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
            
            # Apply edge detection
            edges = cv2.Canny(gray, 50, 150, apertureSize=3)
            
            # Find contours
            contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            detections = []
            for i, contour in enumerate(contours):
                # Filter by area (billboards are typically large)
                area = cv2.contourArea(contour)
                if area > 5000:  # Minimum area threshold
                    x, y, w, h = cv2.boundingRect(contour)
                    
                    # Check aspect ratio (billboards are typically rectangular)
                    aspect_ratio = w / h
                    if 1.5 <= aspect_ratio <= 5.0:  # Typical billboard ratios
                        confidence = min(0.9, area / 50000)  # Simple confidence calculation
                        
                        detections.append({
                            "id": f"billboard_{i}",
                            "bbox": [x, y, w, h],
                            "confidence": confidence,
                            "area": area,
                            "aspect_ratio": aspect_ratio
                        })
            
            logger.info(f"Detected {len(detections)} potential billboards")
            return detections
            
        except Exception as e:
            logger.error(f"Error in billboard detection: {str(e)}")
            return []
    
    def analyze_content(self, image: np.ndarray, bbox: List[int] = None) -> Dict:
        """Analyze billboard content for violations"""
        try:
            # If bbox provided, crop the image to billboard area
            if bbox:
                x, y, w, h = bbox
                roi = image[y:y+h, x:x+w]
            else:
                roi = image
            
            # Convert to PIL for easier processing
            pil_image = Image.fromarray(roi)
            
            # Simple content analysis (in real implementation, use ML models)
            analysis = {
                "has_obscene_content": False,
                "has_political_content": False,
                "has_misinformation": False,
                "content_type": "advertisement",
                "text_detected": [],
                "dominant_colors": self._get_dominant_colors(roi),
                "brightness": np.mean(cv2.cvtColor(roi, cv2.COLOR_RGB2GRAY))
            }
            
            # Simple checks (replace with actual ML models)
            gray_roi = cv2.cvtColor(roi, cv2.COLOR_RGB2GRAY)
            
            # Check for text density (high text density might indicate info overload)
            edges = cv2.Canny(gray_roi, 50, 150)
            text_density = np.sum(edges > 0) / edges.size
            
            if text_density > 0.3:  # Threshold for excessive text
                analysis["violations"] = ["Excessive text content"]
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error in content analysis: {str(e)}")
            return {"error": str(e)}
    
    def _get_dominant_colors(self, image: np.ndarray, k: int = 3) -> List[List[int]]:
        """Extract dominant colors from image"""
        try:
            data = image.reshape((-1, 3))
            data = np.float32(data)
            
            criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
            _, labels, centers = cv2.kmeans(data, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
            
            centers = np.uint8(centers)
            return centers.tolist()
        except:
            return [[128, 128, 128]]  # Default gray if error
    
    def check_compliance(self, detection: Dict, location: Dict = None) -> Dict:
        """Check billboard compliance with regulations"""
        violations = []
        compliance_score = 1.0
        
        # Size compliance (example thresholds)
        area = detection.get("area", 0)
        if area > 100000:  # Too large
            violations.append("Exceeds maximum size limit")
            compliance_score -= 0.3
        
        # Aspect ratio compliance
        aspect_ratio = detection.get("aspect_ratio", 1.0)
        if aspect_ratio > 4.0:  # Too wide
            violations.append("Non-compliant aspect ratio")
            compliance_score -= 0.2
        
        # Location-based checks (if location provided)
        if location:
            lat, lng = location.get("latitude", 0), location.get("longitude", 0)
            
            # Example: Check proximity to schools/hospitals (simplified)
            # In real implementation, use geospatial databases
            if self._is_near_sensitive_area(lat, lng):
                violations.append("Too close to sensitive area")
                compliance_score -= 0.4
        
        return {
            "is_compliant": len(violations) == 0,
            "compliance_score": max(0, compliance_score),
            "violations": violations
        }
    
    def _is_near_sensitive_area(self, lat: float, lng: float) -> bool:
        """Check if location is near sensitive areas"""
        # Simplified check - in reality, use proper geospatial queries
        # Example sensitive coordinates (schools, hospitals)
        sensitive_areas = [
            {"lat": 28.6139, "lng": 77.2090, "type": "school"},
            {"lat": 28.6130, "lng": 77.2080, "type": "hospital"}
        ]
        
        for area in sensitive_areas:
            # Simple distance calculation (use proper geospatial distance)
            distance = ((lat - area["lat"]) ** 2 + (lng - area["lng"]) ** 2) ** 0.5
            if distance < 0.01:  # Within ~1km (very simplified)
                return True
        return False

# Initialize detector
detector = BillboardDetector()

@app.post("/detect")
async def detect_billboard(
    file: UploadFile = File(...),
    latitude: Optional[float] = None,
    longitude: Optional[float] = None
):
    """Detect and analyze billboard in uploaded image"""
    try:
        logger.info(f"Processing image: {file.filename}")
        
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read and process image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        image_array = np.array(image)
        
        # Detect billboards
        detections = detector.detect_billboards(image_array)
        
        violations = []
        compliant_billboards = []
        
        for detection in detections:
            # Analyze content
            content_analysis = detector.analyze_content(
                image_array, 
                detection.get('bbox')
            )
            
            # Check compliance
            location_data = None
            if latitude and longitude:
                location_data = {"latitude": latitude, "longitude": longitude}
            
            compliance_check = detector.check_compliance(detection, location_data)
            
            billboard_data = {
                "detection_id": detection["id"],
                "confidence": detection["confidence"],
                "bbox": detection["bbox"],
                "content_analysis": content_analysis,
                "compliance": compliance_check,
                "timestamp": datetime.now().isoformat()
            }
            
            if not compliance_check["is_compliant"]:
                violations.append(billboard_data)
            else:
                compliant_billboards.append(billboard_data)
        
        # Generate response
        response = {
            "status": "success",
            "processing_time": datetime.now().isoformat(),
            "image_info": {
                "filename": file.filename,
                "size": len(contents),
                "dimensions": f"{image.width}x{image.height}"
            },
            "location": {
                "latitude": latitude,
                "longitude": longitude
            } if latitude and longitude else None,
            "detection_summary": {
                "total_billboards": len(detections),
                "violations_found": len(violations),
                "compliant_billboards": len(compliant_billboards)
            },
            "violations": violations,
            "compliant_billboards": compliant_billboards
        }
        
        logger.info(f"Analysis complete: {len(violations)} violations found")
        return response
        
    except Exception as e:
        logger.error(f"Processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@app.post("/analyze-batch")
async def analyze_batch(files: List[UploadFile] = File(...)):
    """Analyze multiple images in batch"""
    results = []
    
    for file in files:
        try:
            result = await detect_billboard(file)
            results.append({
                "filename": file.filename,
                "result": result,
                "status": "success"
            })
        except Exception as e:
            results.append({
                "filename": file.filename,
                "error": str(e),
                "status": "error"
            })
    
    return {
        "batch_results": results,
        "total_processed": len(files),
        "successful": len([r for r in results if r["status"] == "success"]),
        "failed": len([r for r in results if r["status"] == "error"])
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Billboard Detection AI",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/capabilities")
async def get_capabilities():
    """Get AI service capabilities"""
    return {
        "detection_types": [
            "billboard_detection",
            "size_analysis",
            "content_analysis",
            "compliance_checking"
        ],
        "supported_formats": ["jpg", "jpeg", "png", "bmp"],
        "max_file_size": "10MB",
        "features": {
            "real_time_analysis": True,
            "batch_processing": True,
            "location_aware": True,
            "content_filtering": True
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)
