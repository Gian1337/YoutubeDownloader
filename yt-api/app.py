from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import yt_dlp
import os
import tempfile
import uuid
import logging
import re  
from pathlib import Path

app = Flask(__name__)
CORS(app, resources={r"/download": {"origins": "http://localhost:3000"}})


logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def is_valid_youtube_url(url):
    youtube_regex = (
        r'(https?://)?(www\.)?'
        '(youtube|youtu|youtube-nocookie)\.(com|be)/'
        '(watch\?v=|embed/|v/|.+\?v=)?([^&=%\?]{11})')
    
    return bool(re.match(youtube_regex, url))

@app.route('/download', methods=['POST'])
def download_video():
    try:
        if not request.is_json:
            return jsonify({'error': 'Se requiere JSON en el body'}), 400

        data = request.get_json()
        
        if not data or 'url' not in data:
            return jsonify({'error': 'URL no proporcionada'}), 400
        
        video_url = data['url']
        
        if not is_valid_youtube_url(video_url):
            return jsonify({'error': 'URL de YouTube no válida'}), 400
        
        logger.debug(f"Procesando URL: {video_url}")
        
        
        temp_dir = tempfile.mkdtemp()
        unique_filename = f"{uuid.uuid4().hex}.mp4"
        file_path = os.path.join(temp_dir, unique_filename)
        
        
        ydl_opts = {
            'format': 'best[ext=mp4]',
            'outtmpl': file_path,
            'quiet': False,
            'no_warnings': False,
            'extract_flat': False,
        }
        
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                
                info = ydl.extract_info(video_url, download=True)
                video_title = info.get('title', 'video')
            
            if not os.path.exists(file_path):
                return jsonify({'error': 'Error al guardar el archivo'}), 500
            
            
            return send_file(
                file_path,
                as_attachment=True,
                download_name=f"{video_title}.mp4",
                mimetype='video/mp4'
            )
            
        except Exception as e:
            logger.error(f"Error durante la descarga: {str(e)}")
            return jsonify({'error': f'Error al procesar el video: {str(e)}'}), 500
        
        finally:
            
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
                if os.path.exists(temp_dir):
                    os.rmdir(temp_dir)
            except Exception as e:
                logger.error(f"Error limpiando archivos: {str(e)}")
            
    except Exception as e:
        logger.error(f"Error general: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)