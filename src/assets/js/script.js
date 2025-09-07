// Global variables
let currentColor = "#2e8b57"
let currentHue = 0
let currentSaturation = 100
let currentLightness = 50
const savedColors = JSON.parse(localStorage.getItem("savedColors")) || []

// DOM elements
const colorPicker = document.getElementById("colorPicker")
const colorDisplay = document.getElementById("colorDisplay")
const hexInput = document.getElementById("hexInput")
const rInput = document.getElementById("rInput")
const gInput = document.getElementById("gInput")
const bInput = document.getElementById("bInput")
const hexResult = document.getElementById("hexResult")
const rgbResult = document.getElementById("rgbResult")
const hslResult = document.getElementById("hslResult")
const paletteGrid = document.getElementById("paletteGrid")
const savedColorsContainer = document.getElementById("savedColors")
const toast = document.getElementById("toast")
const toastMessage = document.getElementById("toastMessage")

const colorCanvas = document.getElementById("colorCanvas")
const saturationLightness = document.getElementById("saturationLightness")
const pickerCursor = document.getElementById("pickerCursor")
const hueSlider = document.getElementById("hueSlider")
const hueCursor = document.getElementById("hueCursor")

const uploadArea = document.getElementById("uploadArea")
const photoInput = document.getElementById("photoInput")
const photoCanvas = document.getElementById("photoCanvas")
const photoPreviewSection = document.getElementById("photoPreviewSection")
const extractedColorsSection = document.getElementById("extractedColorsSection")
const colorCountSlider = document.getElementById("colorCount")
const colorCountValue = document.getElementById("colorCountValue")

const gradientColor1 = document.getElementById("gradientColor1")
const gradientColor2 = document.getElementById("gradientColor2")
const gradientDirection = document.getElementById("gradientDirection")
const gradientPreview = document.getElementById("gradientPreview")
const gradientCode = document.getElementById("gradientCode")

const foregroundColor = document.getElementById("foregroundColor")
const backgroundColor = document.getElementById("backgroundColor")
const contrastPreview = document.getElementById("contrastPreview")
const contrastRatio = document.getElementById("contrastRatio")
const accessibilityBadges = document.getElementById("accessibilityBadges")

const colorWheel = document.getElementById("colorWheel")
const harmonyButtons = document.querySelectorAll(".harmony-btn")
const harmonyColors = document.getElementById("harmonyColors")
const psychologyInfo = document.getElementById("psychologyInfo")

const baseColorInput = document.getElementById("baseColor")
const baseColorHexInput = document.getElementById("baseColorHex")
const generatedPalette = document.getElementById("generatedPalette")

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
    initializeColorPicker()
    initializePhotoExtractor()
    initializeAdvancedTools()
    initializePaletteGenerator()
    initializeColorHarmony()
    initNavigation()
    loadSavedColors()
    generatePalette()
})

function initializeColorPicker() {
    let isDraggingPicker = false
    let isDraggingHue = false

    // Initialize color display
    updateColor(currentColor)

    // Saturation/Lightness picker events
    saturationLightness.addEventListener("mousedown", (e) => {
        isDraggingPicker = true
        updatePickerPosition(e)
    })

    document.addEventListener("mousemove", (e) => {
        if (isDraggingPicker) {
            updatePickerPosition(e)
        }
        if (isDraggingHue) {
            updateHuePosition(e)
        }
    })

    document.addEventListener("mouseup", () => {
        isDraggingPicker = false
        isDraggingHue = false
    })

    // Hue slider events
    hueSlider.addEventListener("mousedown", (e) => {
        isDraggingHue = true
        updateHuePosition(e)
    })

    // Touch events for mobile
    saturationLightness.addEventListener("touchstart", (e) => {
        e.preventDefault()
        isDraggingPicker = true
        updatePickerPosition(e.touches[0])
    })

    hueSlider.addEventListener("touchstart", (e) => {
        e.preventDefault()
        isDraggingHue = true
        updateHuePosition(e.touches[0])
    })

    document.addEventListener("touchmove", (e) => {
        if (isDraggingPicker) {
            e.preventDefault()
            updatePickerPosition(e.touches[0])
        }
        if (isDraggingHue) {
            e.preventDefault()
            updateHuePosition(e.touches[0])
        }
    })

    document.addEventListener("touchend", () => {
        isDraggingPicker = false
        isDraggingHue = false
    })

    // Input events
    hexInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/[^0-9A-F]/gi, '')
        if (value.length > 6) value = value.slice(0, 6)
        e.target.value = value

        if (value.length === 6) {
            updateColor("#" + value)
        }
    })

    rInput.addEventListener("input", updateFromRgb)
    gInput.addEventListener("input", updateFromRgb)
    bInput.addEventListener("input", updateFromRgb)
}

function updatePickerPosition(e) {
    const rect = saturationLightness.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left))
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top))

    const saturation = (x / rect.width) * 100
    const lightness = (y / rect.height) * 100

    currentSaturation = saturation
    currentLightness = lightness

    pickerCursor.style.left = `${x}px`
    pickerCursor.style.top = `${y}px`

    const color = hsvToHex(currentHue, saturation, 100 - lightness)
    updateColor(color)
}

function updateHuePosition(e) {
    const rect = hueSlider.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left))
    const hue = (x / rect.width) * 360

    currentHue = hue
    hueCursor.style.left = `${x}px`

    // Update saturation/lightness background
    saturationLightness.style.background = `
                linear-gradient(to bottom, transparent 0%, #000 100%),
                linear-gradient(to right, #fff 0%, hsl(${hue}, 100%, 50%) 100%)
            `

    const color = hsvToHex(hue, currentSaturation, currentLightness)
    updateColor(color)
}

function updateFromRgb() {
    const r = parseInt(rInput.value) || 0
    const g = parseInt(gInput.value) || 0
    const b = parseInt(bInput.value) || 0

    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
        const color = rgbToHex(r, g, b)
        updateColor(color)
    }
}

// Update color function
function updateColor(color) {
    currentColor = color

    // Update color display
    colorDisplay.style.backgroundColor = color
    colorDisplay.textContent = color.toUpperCase()

    // Convert to RGB and HSV
    const rgb = hexToRgb(color)
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

    currentHue = hsv.h
    currentSaturation = hsv.s
    currentLightness = 100 - hsv.v

    const pickerX = (currentSaturation / 100) * saturationLightness.offsetWidth
    const pickerY = (currentLightness / 100) * saturationLightness.offsetHeight
    pickerCursor.style.left = `${pickerX}px`
    pickerCursor.style.top = `${pickerY}px`

    // Update hue cursor position
    const hueX = (currentHue / 360) * hueSlider.offsetWidth
    hueCursor.style.left = `${hueX}px`

    // Update saturation/lightness background
    saturationLightness.style.background = `
                linear-gradient(to bottom, transparent 0%, #000 100%),
                linear-gradient(to right, #fff 0%, hsl(${currentHue}, 100%, 50%) 100%)
            `

    // Update inputs
    hexInput.value = color.replace("#", "")
    rInput.value = rgb.r
    gInput.value = rgb.g
    bInput.value = rgb.b

    // Update results
    hexResult.textContent = color.toUpperCase()
    rgbResult.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    hslResult.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
}

// Color conversion functions
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

function rgbToHsl(r, g, b) {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2

    if (max === min) {
        h = s = 0
    } else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0)
                break
            case g:
                h = (b - r) / d + 2
                break
            case b:
                h = (r - g) / d + 4
                break
        }
        h /= 6
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    }
}

function hslToHex(h, s, l) {
    h = h / 360
    s = s / 100
    l = l / 100

    const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
    }

    let r, g, b

    if (s === 0) {
        r = g = b = l
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q
        r = hue2rgb(p, q, h + 1 / 3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - 1 / 3)
    }

    const toHex = (c) => {
        const hex = Math.round(c * 255).toString(16)
        return hex.length === 1 ? "0" + hex : hex
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function isValidHex(hex) {
    return /^[0-9A-F]{6}$/i.test(hex)
}

// Generate random color palette
function generatePalette() {
    paletteGrid.innerHTML = ""

    for (let i = 0; i < 12; i++) {
        const randomColor =
            "#" +
            Math.floor(Math.random() * 16777215)
                .toString(16)
                .padStart(6, "0")
        const colorDiv = document.createElement("div")
        colorDiv.className = "palette-color"
        colorDiv.style.backgroundColor = randomColor
        colorDiv.setAttribute("data-color", randomColor)
        colorDiv.addEventListener("click", () => updateColor(randomColor))
        paletteGrid.appendChild(colorDiv)
    }
}

// Save current color
function saveCurrentColor() {
    if (!savedColors.includes(currentColor)) {
        savedColors.push(currentColor)
        localStorage.setItem("savedColors", JSON.stringify(savedColors))
        displaySavedColors()
        showToast("Farbe gespeichert!")
    } else {
        showToast("Farbe bereits gespeichert!")
    }
}

// Display saved colors
function displaySavedColors() {
    savedColorsContainer.innerHTML = ""

    if (savedColors.length === 0) {
        savedColorsContainer.innerHTML =
            '<p style="color: #7f8c8d; text-align: center; grid-column: 1/-1;">Keine gespeicherten Farben</p>'
        return
    }

    savedColors.forEach((color, index) => {
        const colorDiv = document.createElement("div")
        colorDiv.className = "saved-color"
        colorDiv.style.backgroundColor = color
        colorDiv.setAttribute("data-color", color)
        colorDiv.addEventListener("click", () => updateColor(color))

        const deleteBtn = document.createElement("button")
        deleteBtn.className = "delete-btn"
        deleteBtn.innerHTML = "×"
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation()
            deleteSavedColor(index)
        })

        colorDiv.appendChild(deleteBtn)
        savedColorsContainer.appendChild(colorDiv)
    })
}

// Delete saved color
function deleteSavedColor(index) {
    savedColors.splice(index, 1)
    localStorage.setItem("savedColors", JSON.stringify(savedColors))
    displaySavedColors()
    showToast("Farbe gelöscht!")
}

// Copy to clipboard
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId)
    const text = element.textContent

    navigator.clipboard
        .writeText(text)
        .then(() => {
            showToast(`${text} kopiert!`)
        })
        .catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement("textarea")
            textArea.value = text
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand("copy")
            document.body.removeChild(textArea)
            showToast(`${text} kopiert!`)
        })
}

// Show toast notification
function showToast(message) {
    toastMessage.textContent = message
    toast.classList.add("show")

    setTimeout(() => {
        toast.classList.remove("show")
    }, 3000)
}

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case "s":
                e.preventDefault()
                saveCurrentColor()
                break
            case "g":
                e.preventDefault()
                generatePalette()
                break
        }
    }
})

function rgbToHsv(r, g, b) {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const diff = max - min

    let h = 0
    const s = max === 0 ? 0 : diff / max
    const v = max

    if (diff !== 0) {
        switch (max) {
            case r:
                h = (g - b) / diff + (g < b ? 6 : 0)
                break
            case g:
                h = (b - r) / diff + 2
                break
            case b:
                h = (r - g) / diff + 4
                break
        }
        h /= 6
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100),
    }
}

function hsvToHex(h, s, v) {
    h = h / 360
    s = s / 100
    v = v / 100

    const c = v * s
    const x = c * (1 - Math.abs(((h * 6) % 2) - 1))
    const m = v - c

    let r = 0, g = 0, b = 0

    if (0 <= h && h < 1 / 6) {
        r = c
        g = x
        b = 0
    } else if (1 / 6 <= h && h < 2 / 6) {
        r = x
        g = c
        b = 0
    } else if (2 / 6 <= h && h < 3 / 6) {
        r = 0
        g = c
        b = x
    } else if (3 / 6 <= h && h < 4 / 6) {
        r = 0
        g = x
        b = c
    } else if (4 / 6 <= h && h < 5 / 6) {
        r = x
        g = 0
        b = c
    } else if (5 / 6 <= h && h < 1) {
        r = c
        g = 0
        b = x
    }

    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    return rgbToHex(r, g, b)
}

// Navigation system
function initNavigation() {
    const navButtons = document.querySelectorAll(".nav-btn")
    const pages = document.querySelectorAll(".page")

    navButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const targetPage = button.getAttribute("data-page")

            // Remove active class from all buttons and pages
            navButtons.forEach((btn) => btn.classList.remove("active"))
            pages.forEach((page) => {
                page.style.display = "none"
                page.classList.remove("active")
            })

            // Add active class to clicked button and show target page
            button.classList.add("active")
            const targetPageElement = document.getElementById(targetPage)
            if (targetPageElement) {
                targetPageElement.style.display = "block"
                targetPageElement.classList.add("active")
            }
        })
    })
}

// Initialize photo color extractor
function initializePhotoExtractor() {
    if (!uploadArea || !photoInput || !photoCanvas) return

    // Update color count display
    if (colorCountSlider && colorCountValue) {
        colorCountSlider.addEventListener("input", () => {
            colorCountValue.textContent = colorCountSlider.value
        })
    }

    // Drag and drop functionality
    uploadArea.addEventListener("dragover", (e) => {
        e.preventDefault()
        uploadArea.classList.add("dragover")
    })

    uploadArea.addEventListener("dragleave", () => {
        uploadArea.classList.remove("dragover")
    })

    uploadArea.addEventListener("drop", (e) => {
        e.preventDefault()
        uploadArea.classList.remove("dragover")
        const files = e.dataTransfer.files
        if (files.length > 0 && files[0].type.startsWith("image/")) {
            handleImageUpload(files[0])
        }
    })

    // File input change
    photoInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            handleImageUpload(e.target.files[0])
        }
    })

    // Handle image upload
    function handleImageUpload(file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            const img = new Image()
            img.onload = () => {
                displayImage(img)
                if (photoPreviewSection) {
                    photoPreviewSection.style.display = "block"
                }
            }
            img.src = e.target.result
        }
        reader.readAsDataURL(file)
    }

    // Display image on canvas
    function displayImage(img) {
        const ctx = photoCanvas.getContext("2d")
        const maxWidth = 600
        const maxHeight = 400

        let { width, height } = img

        // Scale image to fit canvas
        if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height)
            width *= ratio
            height *= ratio
        }

        photoCanvas.width = width
        photoCanvas.height = height

        ctx.drawImage(img, 0, 0, width, height)
    }
}

// Extract colors from photo
function extractColors() {
    const photoCanvas = document.getElementById("photoCanvas")
    const extractedColorsSection = document.getElementById("extractedColorsSection")
    const extractedColorsContainer = document.getElementById("extractedColors")
    const colorCount = parseInt(document.getElementById("colorCount")?.value || 8)

    if (!photoCanvas || !extractedColorsContainer) return

    const ctx = photoCanvas.getContext("2d")
    const imageData = ctx.getImageData(0, 0, photoCanvas.width, photoCanvas.height)
    const pixels = imageData.data

    // Sample pixels for color extraction (every 10th pixel for performance)
    const colors = []
    for (let i = 0; i < pixels.length; i += 40) {
        // RGBA = 4 bytes, so i += 40 samples every 10th pixel
        const r = pixels[i]
        const g = pixels[i + 1]
        const b = pixels[i + 2]
        const a = pixels[i + 3]

        // Skip transparent pixels
        if (a < 128) continue

        colors.push({ r, g, b })
    }

    // Use k-means clustering to find dominant colors
    const dominantColors = extractDominantColors(colors, colorCount)

    // Display extracted colors
    displayExtractedColors(dominantColors)

    if (extractedColorsSection) {
        extractedColorsSection.style.display = "block"
    }
}

// K-means clustering for color extraction
function extractDominantColors(colors, k) {
    if (colors.length === 0) return []

    // Initialize centroids randomly
    let centroids = []
    for (let i = 0; i < k; i++) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)]
        centroids.push({ ...randomColor })
    }

    // K-means iterations
    for (let iteration = 0; iteration < 10; iteration++) {
        const clusters = Array(k)
            .fill()
            .map(() => [])

        // Assign each color to nearest centroid
        colors.forEach((color) => {
            let minDistance = Number.POSITIVE_INFINITY
            let closestCentroid = 0

            centroids.forEach((centroid, index) => {
                const distance = Math.sqrt(
                    Math.pow(color.r - centroid.r, 2) + Math.pow(color.g - centroid.g, 2) + Math.pow(color.b - centroid.b, 2),
                )

                if (distance < minDistance) {
                    minDistance = distance
                    closestCentroid = index
                }
            })

            clusters[closestCentroid].push(color)
        })

        // Update centroids
        centroids = clusters.map((cluster) => {
            if (cluster.length === 0) return centroids[0] // Keep old centroid if cluster is empty

            const avgR = cluster.reduce((sum, color) => sum + color.r, 0) / cluster.length
            const avgG = cluster.reduce((sum, color) => sum + color.g, 0) / cluster.length
            const avgB = cluster.reduce((sum, color) => sum + color.b, 0) / cluster.length

            return {
                r: Math.round(avgR),
                g: Math.round(avgG),
                b: Math.round(avgB),
            }
        })
    }

    // Sort by frequency (cluster size) and convert to hex
    const clusters = Array(k)
        .fill()
        .map(() => [])
    return centroids
        .map((centroid, index) => ({
            color: rgbToHex(centroid.r, centroid.g, centroid.b),
            frequency: clusters[index]?.length || 0,
        }))
        .sort((a, b) => b.frequency - a.frequency)
        .map((item) => item.color)
}

// Display extracted colors
function displayExtractedColors(colors) {
    const container = document.getElementById("extractedColors")
    if (!container) return

    container.innerHTML = ""

    colors.forEach((color) => {
        const colorElement = document.createElement("div")
        colorElement.className = "extracted-color"
        colorElement.innerHTML = `
                    <div class="extracted-color-swatch" style="background-color: ${color}"></div>
                    <div class="extracted-color-code">${color.toUpperCase()}</div>
                `

        colorElement.addEventListener("click", () => {
            // Switch to color picker page and set the color
            const colorPickerBtn = document.querySelector('[data-page="color-picker"]')
            if (colorPickerBtn) {
                colorPickerBtn.click()
                setTimeout(() => updateColor(color), 100)
            }
            showToast(`Farbe ${color} ausgewählt!`)
        })

        container.appendChild(colorElement)
    })
}

// Initialize advanced color tools
function initializeAdvancedTools() {
    initializeGradientGenerator()
    initializeContrastChecker()
}

// Gradient Generator
function initializeGradientGenerator() {
    if (!gradientColor1 || !gradientColor2 || !gradientDirection || !gradientPreview || !gradientCode) return

    function updateGradient() {
        const color1 = gradientColor1.value
        const color2 = gradientColor2.value
        const direction = gradientDirection.value

        const gradientCSS = `linear-gradient(${direction}, ${color1}, ${color2})`

        gradientPreview.style.background = gradientCSS
        gradientCode.textContent = `background: ${gradientCSS};`
    }

    gradientColor1.addEventListener("input", updateGradient)
    gradientColor2.addEventListener("input", updateGradient)
    gradientDirection.addEventListener("change", updateGradient)

    // Initialize with default values
    updateGradient()
}

// Contrast Checker
function initializeContrastChecker() {
    if (!foregroundColor || !backgroundColor || !contrastPreview || !contrastRatio || !accessibilityBadges) return

    function updateContrastChecker() {
        const fgColor = foregroundColor.value
        const bgColor = backgroundColor.value

        // Update preview
        contrastPreview.style.backgroundColor = bgColor
        contrastPreview.style.color = fgColor

        // Calculate contrast ratio
        const ratio = calculateContrastRatio(fgColor, bgColor)
        contrastRatio.textContent = `${ratio.toFixed(2)}:1`

        // Update accessibility badges
        updateAccessibilityBadges(ratio)
    }

    function calculateContrastRatio(color1, color2) {
        const rgb1 = hexToRgb(color1)
        const rgb2 = hexToRgb(color2)

        const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b)
        const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b)

        const lighter = Math.max(l1, l2)
        const darker = Math.min(l1, l2)

        return (lighter + 0.05) / (darker + 0.05)
    }

    function getRelativeLuminance(r, g, b) {
        const [rs, gs, bs] = [r, g, b].map((c) => {
            c = c / 255
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
        })

        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
    }

    function updateAccessibilityBadges(ratio) {
        const badges = [
            { text: "AA Normal", threshold: 4.5 },
            { text: "AA Large", threshold: 3.0 },
            { text: "AAA Normal", threshold: 7.0 },
        ]

        accessibilityBadges.innerHTML = badges
            .map((badge) => {
                const passes = ratio >= badge.threshold
                return `<span class="badge ${passes ? "pass" : "fail"}">${badge.text}</span>`
            })
            .join("")
    }

    foregroundColor.addEventListener("input", updateContrastChecker)
    backgroundColor.addEventListener("input", updateContrastChecker)

    // Initialize with default values
    updateContrastChecker()
}

// Palette Generator
function initializePaletteGenerator() {
    const paletteTypeButtons = document.querySelectorAll(".palette-type-btn")
    const baseColorInput = document.getElementById("baseColor")
    const baseColorHexInput = document.getElementById("baseColorHex")
    const generatedPalette = document.getElementById("generatedPalette")

    if (!paletteTypeButtons.length || !baseColorInput || !baseColorHexInput || !generatedPalette) return

    let currentPaletteType = "monochromatic"

    // Palette type selection
    paletteTypeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            paletteTypeButtons.forEach((btn) => btn.classList.remove("active"))
            button.classList.add("active")
            currentPaletteType = button.getAttribute("data-type")
            window.generateColorPalette()
        })
    })

    // Base color input synchronization
    baseColorInput.addEventListener("input", () => {
        baseColorHexInput.value = baseColorInput.value
        window.generateColorPalette()
    })

    baseColorHexInput.addEventListener("input", () => {
        const hex = baseColorHexInput.value
        if (isValidHex(hex.replace("#", ""))) {
            baseColorInput.value = hex.startsWith("#") ? hex : "#" + hex
            window.generateColorPalette()
        }
    })

    // Generate palette function
    window.generateColorPalette = () => {
        const baseColor = baseColorInput.value
        const colors = generatePaletteColors(baseColor, currentPaletteType)
        displayGeneratedPalette(colors)
    }

    // Export palette function
    window.exportPalette = () => {
        const paletteColors = Array.from(generatedPalette.children).map((child) => ({
            hex: child.getAttribute("data-color"),
            name: child.querySelector(".palette-color-name")?.textContent || "Unnamed",
        }))

        const paletteData = {
            type: currentPaletteType,
            baseColor: baseColorInput.value,
            colors: paletteColors,
            createdAt: new Date().toISOString(),
        }

        const dataStr = JSON.stringify(paletteData, null, 2)
        const dataBlob = new Blob([dataStr], { type: "application/json" })
        const url = URL.createObjectURL(dataBlob)

        const link = document.createElement("a")
        link.href = url
        link.download = `color-palette-${currentPaletteType}-${Date.now()}.json`
        link.click()

        URL.revokeObjectURL(url)
        showToast("Palette als JSON exportiert!")
    }

    // Initialize with default palette
    window.generateColorPalette()
}

function generatePaletteColors(baseColor, type) {
    const baseRgb = hexToRgb(baseColor)
    const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b)

    switch (type) {
        case "monochromatic":
            return generateMonochromaticPalette(baseHsl)
        case "analogous":
            return generateAnalogousPalette(baseHsl)
        case "complementary":
            return generateComplementaryPalette(baseHsl)
        case "triadic":
            return generateTriadicPalette(baseHsl)
        case "tetradic":
            return generateTetradicPalette(baseHsl)
        default:
            return [baseColor]
    }
}

function generateMonochromaticPalette(baseHsl) {
    const colors = []
    const lightnessValues = [20, 35, 50, 65, 80]

    lightnessValues.forEach((lightness) => {
        const color = hslToHex(baseHsl.h, baseHsl.s, lightness)
        colors.push(color)
    })

    return colors
}

function generateAnalogousPalette(baseHsl) {
    const colors = []
    const hueOffsets = [-60, -30, 0, 30, 60]

    hueOffsets.forEach((offset) => {
        const hue = (baseHsl.h + offset + 360) % 360
        const color = hslToHex(hue, baseHsl.s, baseHsl.l)
        colors.push(color)
    })

    return colors
}

function generateComplementaryPalette(baseHsl) {
    const colors = []
    const complementaryHue = (baseHsl.h + 180) % 360

    // Base color variations
    colors.push(hslToHex(baseHsl.h, baseHsl.s, Math.max(20, baseHsl.l - 20)))
    colors.push(hslToHex(baseHsl.h, baseHsl.s, baseHsl.l))
    colors.push(hslToHex(baseHsl.h, baseHsl.s, Math.min(80, baseHsl.l + 20)))

    // Complementary color variations
    colors.push(hslToHex(complementaryHue, baseHsl.s, Math.max(20, baseHsl.l - 20)))
    colors.push(hslToHex(complementaryHue, baseHsl.s, baseHsl.l))
    colors.push(hslToHex(complementaryHue, baseHsl.s, Math.min(80, baseHsl.l + 20)))

    return colors
}

function generateTriadicPalette(baseHsl) {
    const colors = []
    const hueOffsets = [0, 120, 240]

    hueOffsets.forEach((offset) => {
        const hue = (baseHsl.h + offset) % 360
        colors.push(hslToHex(hue, baseHsl.s, Math.max(20, baseHsl.l - 10)))
        colors.push(hslToHex(hue, baseHsl.s, baseHsl.l))
        colors.push(hslToHex(hue, baseHsl.s, Math.min(80, baseHsl.l + 10)))
    })

    return colors
}

function generateTetradicPalette(baseHsl) {
    const colors = []
    const hueOffsets = [0, 90, 180, 270]

    hueOffsets.forEach((offset) => {
        const hue = (baseHsl.h + offset) % 360
        colors.push(hslToHex(hue, Math.max(30, baseHsl.s - 20), baseHsl.l))
        colors.push(hslToHex(hue, baseHsl.s, baseHsl.l))
    })

    return colors
}

function displayGeneratedPalette(colors) {
    const container = document.getElementById("generatedPalette")
    if (!container) return

    container.innerHTML = ""

    colors.forEach((color, index) => {
        const colorElement = document.createElement("div")
        colorElement.className = "generated-palette-color"
        colorElement.setAttribute("data-color", color)
        colorElement.innerHTML = `
                    <div class="palette-color-swatch" style="background-color: ${color}"></div>
                    <div class="palette-color-info">
                        <div class="palette-color-name">Color ${index + 1}</div>
                        <div class="palette-color-code">${color.toUpperCase()}</div>
                    </div>
                `

        colorElement.addEventListener("click", () => {
            // Switch to color picker page and set the color
            const colorPickerBtn = document.querySelector('[data-page="color-picker"]')
            if (colorPickerBtn) {
                colorPickerBtn.click()
                setTimeout(() => updateColor(color), 100)
            }
            showToast(`Farbe ${color} ausgewählt!`)
        })

        container.appendChild(colorElement)
    })
}

// Color Harmony and Theory
function initializeColorHarmony() {
    const colorWheel = document.getElementById("colorWheel")
    const harmonyButtons = document.querySelectorAll(".harmony-btn")
    const harmonyColors = document.getElementById("harmonyColors")
    const psychologyInfo = document.getElementById("psychologyInfo")

    if (!colorWheel || !harmonyButtons.length || !harmonyColors || !psychologyInfo) return

    let currentHarmonyType = "complementary"
    let selectedHue = 0

    // Initialize color wheel
    drawColorWheel()

    // Harmony type selection
    harmonyButtons.forEach((button) => {
        button.addEventListener("click", () => {
            harmonyButtons.forEach((btn) => btn.classList.remove("active"))
            button.classList.add("active")
            currentHarmonyType = button.getAttribute("data-harmony")
            updateHarmonyColors()
        })
    })

    // Color wheel interaction
    colorWheel.addEventListener("click", (e) => {
        const rect = colorWheel.getBoundingClientRect()
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const x = e.clientX - rect.left - centerX
        const y = e.clientY - rect.top - centerY

        const angle = Math.atan2(y, x)
        const hue = ((angle * 180) / Math.PI + 360) % 360

        selectedHue = hue
        updateHarmonyColors()
        updateColorPsychology(hue)
    })

    function drawColorWheel() {
        const ctx = colorWheel.getContext("2d")
        const centerX = colorWheel.width / 2
        const centerY = colorWheel.height / 2
        const radius = Math.min(centerX, centerY) - 10

        // Draw color wheel
        for (let angle = 0; angle < 360; angle += 1) {
            const startAngle = ((angle - 1) * Math.PI) / 180
            const endAngle = (angle * Math.PI) / 180

            ctx.beginPath()
            ctx.arc(centerX, centerY, radius, startAngle, endAngle)
            ctx.arc(centerX, centerY, radius * 0.3, endAngle, startAngle, true)
            ctx.closePath()

            const hue = angle
            ctx.fillStyle = `hsl(${hue}, 100%, 50%)`
            ctx.fill()
        }

        // Draw inner circle (white)
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius * 0.3, 0, 2 * Math.PI)
        ctx.fillStyle = "white"
        ctx.fill()
    }

    function updateHarmonyColors() {
        const colors = generateHarmonyColors(selectedHue, currentHarmonyType)
        displayHarmonyColors(colors)
    }

    function generateHarmonyColors(baseHue, type) {
        const colors = []

        switch (type) {
            case "complementary":
                colors.push(hslToHex(baseHue, 100, 50))
                colors.push(hslToHex((baseHue + 180) % 360, 100, 50))
                break
            case "analogous":
                colors.push(hslToHex((baseHue - 30 + 360) % 360, 100, 50))
                colors.push(hslToHex(baseHue, 100, 50))
                colors.push(hslToHex((baseHue + 30) % 360, 100, 50))
                break
            case "triadic":
                colors.push(hslToHex(baseHue, 100, 50))
                colors.push(hslToHex((baseHue + 120) % 360, 100, 50))
                colors.push(hslToHex((baseHue + 240) % 360, 100, 50))
                break
            case "split-complementary":
                colors.push(hslToHex(baseHue, 100, 50))
                colors.push(hslToHex((baseHue + 150) % 360, 100, 50))
                colors.push(hslToHex((baseHue + 210) % 360, 100, 50))
                break
        }

        return colors
    }

    function displayHarmonyColors(colors) {
        harmonyColors.innerHTML = ""

        colors.forEach((color) => {
            const colorElement = document.createElement("div")
            colorElement.className = "harmony-color"
            colorElement.style.backgroundColor = color
            colorElement.setAttribute("data-color", color)

            colorElement.addEventListener("click", () => {
                const colorPickerBtn = document.querySelector('[data-page="color-picker"]')
                if (colorPickerBtn) {
                    colorPickerBtn.click()
                    setTimeout(() => updateColor(color), 100)
                }
                showToast(`Farbe ${color} ausgewählt!`)
            })

            harmonyColors.appendChild(colorElement)
        })
    }

    function updateColorPsychology(hue) {
        const psychologyData = getColorPsychology(hue)
        psychologyInfo.innerHTML = `
                    <h4>${psychologyData.name}</h4>
                    <p><strong>Emotionale Wirkung:</strong> ${psychologyData.emotions}</p>
                    <p><strong>Verwendung:</strong> ${psychologyData.usage}</p>
                    <p><strong>Kulturelle Bedeutung:</strong> ${psychologyData.cultural}</p>
                `
    }

    function getColorPsychology(hue) {
        if ((hue >= 0 && hue < 30) || hue >= 330) {
            return {
                name: "Rot",
                emotions: "Leidenschaft, Energie, Aufregung, Liebe, Gefahr",
                usage: "Call-to-Action Buttons, Warnungen, Restaurants, Mode",
                cultural: "In westlichen Kulturen: Liebe und Gefahr. In China: Glück und Wohlstand.",
            }
        } else if (hue >= 30 && hue < 60) {
            return {
                name: "Orange",
                emotions: "Wärme, Enthusiasmus, Kreativität, Freundlichkeit",
                usage: "Spielzeug, Sportmarken, kreative Branchen, Herbstthemen",
                cultural: "Buddhismus: Erleuchtung. Halloween: Herbst und Ernte.",
            }
        } else if (hue >= 60 && hue < 120) {
            return {
                name: "Gelb",
                emotions: "Glück, Optimismus, Klarheit, Aufmerksamkeit",
                usage: "Warnzeichen, Kinderprodukte, Sommer-Themen, Taxis",
                cultural: "China: Kaiserliche Macht. Westlich: Vorsicht und Fröhlichkeit.",
            }
        } else if (hue >= 120 && hue < 180) {
            return {
                name: "Grün",
                emotions: "Natur, Wachstum, Harmonie, Frische, Geld",
                usage: "Umwelt, Gesundheit, Finanzen, Bio-Produkte",
                cultural: "Islam: Heilige Farbe. Westlich: Natur und Geld.",
            }
        } else if (hue >= 180 && hue < 240) {
            return {
                name: "Cyan/Türkis",
                emotions: "Ruhe, Klarheit, Erfrischung, Technologie",
                usage: "Tech-Unternehmen, Wellness, Wasser-Themen, moderne Designs",
                cultural: "Ägypten: Schutz. Modern: Digitale Innovation.",
            }
        } else if (hue >= 240 && hue < 300) {
            return {
                name: "Blau",
                emotions: "Vertrauen, Stabilität, Professionalität, Ruhe",
                usage: "Unternehmen, Soziale Medien, Gesundheitswesen, Technologie",
                cultural: "Universell: Vertrauen und Stabilität. Griechenland: Nationalfarbe.",
            }
        } else {
            return {
                name: "Violett/Lila",
                emotions: "Luxus, Kreativität, Spiritualität, Mysterium",
                usage: "Luxusmarken, Kosmetik, Spiritualität, Kunst",
                cultural: "Römisches Reich: Königtum. Modern: Kreativität und Luxus.",
            }
        }
    }

    // Initialize with default harmony
    updateHarmonyColors()
    updateColorPsychology(selectedHue)
}

// Load saved colors on initialization
function loadSavedColors() {
    displaySavedColors()
}