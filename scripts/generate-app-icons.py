from pathlib import Path
from PIL import Image

SOURCE = Path("J_tozza.png")
APP_DIR = Path("src/app")

BACKGROUND = (12, 10, 25, 255)  # #0c0a19
LOGO_SCALE = 0.72


def load_logo() -> Image.Image:
    if not SOURCE.exists():
        raise FileNotFoundError(f"Source file not found: {SOURCE}")

    image = Image.open(SOURCE).convert("RGBA")

    alpha = image.getchannel("A")
    bbox = alpha.getbbox()

    if bbox is None:
        raise ValueError("The source image appears to be fully transparent.")

    return image.crop(bbox)


def make_square_icon(size: int) -> Image.Image:
    logo = load_logo()

    max_logo_size = int(size * LOGO_SCALE)
    logo.thumbnail((max_logo_size, max_logo_size), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (size, size), BACKGROUND)

    x = (size - logo.width) // 2
    y = (size - logo.height) // 2

    canvas.alpha_composite(logo, (x, y))

    return canvas


def main() -> None:
    APP_DIR.mkdir(parents=True, exist_ok=True)

    icon_512 = make_square_icon(512)
    icon_180 = make_square_icon(180)

    icon_512.save(APP_DIR / "icon.png")
    icon_180.save(APP_DIR / "apple-icon.png")

    icon_512.save(
        APP_DIR / "favicon.ico",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
    )

    print("Generated:")
    print(f"- {APP_DIR / 'favicon.ico'}")
    print(f"- {APP_DIR / 'icon.png'}")
    print(f"- {APP_DIR / 'apple-icon.png'}")


if __name__ == "__main__":
    main()
