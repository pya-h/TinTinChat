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
            <p id="modalMessage"></p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" onclick="closeModal()">OK</button>
        </div>
    </div>
</div>
<link href="assets/css/modal.css" rel="stylesheet" />
<script src="assets/js/modal.js"></script>