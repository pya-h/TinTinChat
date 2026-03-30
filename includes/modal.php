<div id="modalOverlay" class="modal-overlay" style="display: none;">
    <div id="modalContainer" class="modal-container">
        <div class="modal-header">
            <div class="modal-icon">
                <i id="modalIcon" class="fas fa-info-circle"></i>
            </div>
            <h4 id="modalTitle" class="modal-title">Information</h4>
            <button type="button" class="modal-close" onclick="closeModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <p id="modalMessage">This is a modal message.</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" onclick="closeModal()">OK</button>
        </div>
    </div>
</div>

<div id="confirmModalOverlay" class="modal-overlay confirm-modal-overlay" style="display: none;">
    <div class="modal-container confirm-modal-container">
        <div class="modal-header">
            <div class="modal-icon warning">
                <i id="confirmModalIcon" class="fas fa-exclamation-circle"></i>
            </div>
            <h4 id="confirmModalTitle" class="modal-title">Confirm</h4>
            <button type="button" class="modal-close" id="confirmModalCloseBtn">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <p id="confirmModalMessage"></p>
        </div>
        <div id="confirmModalPromptWrap" class="confirm-modal-prompt-wrap" style="display:none;">
            <textarea id="confirmModalPromptInput" class="form-control form-control-sm" rows="3"></textarea>
            <div class="confirm-modal-char-count"><span id="confirmModalCharCount">0</span> / <span id="confirmModalCharMax">500</span></div>
        </div>
        <div class="modal-footer confirm-modal-footer">
            <button type="button" class="btn btn-cancel" id="confirmModalCancelBtn">Cancel</button>
            <button type="button" class="btn btn-confirm" id="confirmModalConfirmBtn">Yes</button>
        </div>
    </div>
</div>

<div id="imageModalOverlay" class="image-modal-overlay" style="display: none;">
    <button type="button" class="image-modal-close" onclick="closeImageModal()">
        <i class="fas fa-times"></i>
    </button>
    <div class="image-modal-content">
        <img id="imageModalImage" src="" alt="Full size image" />
    </div>
    <a id="imageModalDownload" href="#" download class="image-modal-download" onclick="downloadImage(event)">
        <i class="fas fa-download"></i>
    </a>
</div>

<link href="assets/css/modal.css?v=<?php echo urlencode((string) @filemtime(__DIR__ . '/../assets/css/modal.css')); ?>" rel="stylesheet" />
<script src="assets/js/modal.js?v=<?php echo urlencode((string) @filemtime(__DIR__ . '/../assets/js/modal.js')); ?>"></script>