#!/usr/bin/env python3
"""Generate audio file: song about Evgeniy with synthesized music and Russian vocals."""

import os
import tempfile
import wave
import struct
from pathlib import Path

import numpy as np
from gtts import gTTS
from pydub import AudioSegment

SAMPLE_RATE = 44100
OUTPUT_DIR = Path("/opt/cursor/artifacts")
OUTPUT_FILE = OUTPUT_DIR / "evgeniy_song.mp3"

# Note frequencies (A minor ballad)
NOTES = {
    "A3": 220.00,
    "B3": 246.94,
    "C4": 261.63,
    "D4": 293.66,
    "E4": 329.63,
    "F4": 349.23,
    "G4": 392.00,
    "A4": 440.00,
    "C5": 523.25,
    "E5": 659.25,
}

CHORDS = {
    "Am": ["A3", "C4", "E4"],
    "F": ["F4", "A3", "C4"],
    "C": ["C4", "E4", "G4"],
    "G": ["G4", "B3", "D4"],
    "Dm": ["D4", "F4", "A3"],
    "E": ["E4", "G4", "B3"],
}


def envelope(length: int, attack: float = 0.02, release: float = 0.15) -> np.ndarray:
    env = np.ones(length)
    a = int(attack * SAMPLE_RATE)
    r = int(release * SAMPLE_RATE)
    if a > 0:
        env[:a] = np.linspace(0, 1, a)
    if r > 0 and r < length:
        env[-r:] = np.linspace(1, 0, r)
    return env


def tone(freq: float, duration: float, volume: float = 0.25, wave_type: str = "sine") -> np.ndarray:
    n = int(duration * SAMPLE_RATE)
    t = np.linspace(0, duration, n, False)
    if wave_type == "sine":
        wave = np.sin(2 * np.pi * freq * t)
    elif wave_type == "soft":
        wave = np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(4 * np.pi * freq * t)
        wave /= 1.3
    else:
        wave = np.sign(np.sin(2 * np.pi * freq * t)) * 0.5 + np.sin(2 * np.pi * freq * t) * 0.5
    return wave * envelope(n) * volume


def chord(notes: list[str], duration: float, volume: float = 0.12) -> np.ndarray:
    parts = [tone(NOTES[n], duration, volume / len(notes), "soft") for n in notes]
    return np.sum(parts, axis=0)


def pad_progression(bpm: float = 72) -> np.ndarray:
    beat = 60 / bpm
    progression = ["Am", "F", "C", "G", "Am", "F", "C", "G"]
    bars = []
    for name in progression:
        bars.append(chord(CHORDS[name], beat * 2))
    return np.concatenate(bars)


def melody_line(bpm: float = 72) -> np.ndarray:
    beat = 60 / bpm
    # Simple lyrical melody over Am-F-C-G
    sequence = [
        ("E4", beat),
        ("G4", beat),
        ("A4", beat * 2),
        ("G4", beat),
        ("F4", beat),
        ("E4", beat * 2),
        ("D4", beat),
        ("E4", beat),
        ("F4", beat * 2),
        ("E4", beat),
        ("C4", beat),
        ("D4", beat * 2),
        ("E4", beat),
        ("G4", beat),
        ("A4", beat * 4),
    ]
    parts = [tone(NOTES[n], d, 0.18, "sine") for n, d in sequence]
    return np.concatenate(parts)


def soft_drums(bpm: float = 72, bars: int = 16) -> np.ndarray:
    beat = 60 / bpm
    half = int(beat * SAMPLE_RATE / 2)
    bar_len = int(beat * 4 * SAMPLE_RATE)
    total = bar_len * bars
    drums = np.zeros(total)
    click = tone(800, 0.04, 0.08, "square")
    low = tone(120, 0.08, 0.12, "square")
    for bar in range(bars):
        base = bar * bar_len
        for beat_i in range(4):
            pos = base + int(beat_i * beat * SAMPLE_RATE)
            if beat_i in (0, 2):
                end = min(pos + len(low), total)
                drums[pos:end] += low[:end - pos]
            if beat_i in (1, 3):
                end = min(pos + len(click), total)
                drums[pos:end] += click[:end - pos]
    return drums


def write_wav(path: Path, audio: np.ndarray) -> None:
    audio = np.clip(audio, -1, 1)
    pcm = (audio * 32767).astype(np.int16)
    with wave.open(str(path), "w") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(pcm.tobytes())


def build_instrumental(duration_sec: float = 150) -> np.ndarray:
    bpm = 72
    beat = 60 / bpm
    bar_dur = beat * 4

    pad_loop = pad_progression(bpm)
    mel_loop = melody_line(bpm)
    bars_needed = int(np.ceil(duration_sec / bar_dur)) + 1

    pad = np.tile(pad_loop, bars_needed)[: int(duration_sec * SAMPLE_RATE)]
    mel = np.tile(mel_loop, bars_needed)[: int(duration_sec * SAMPLE_RATE)]
    drums = soft_drums(bpm, bars_needed)[: int(duration_sec * SAMPLE_RATE)]

    instrumental = pad * 0.9 + mel * 0.7 + drums * 0.5
    max_val = np.max(np.abs(instrumental))
    if max_val > 0:
        instrumental = instrumental / max_val * 0.85
    return instrumental


VOCAL_SECTIONS = [
  (8.0, "В городе утро, в окне рассвет. Евгений — тот, кто не сдаёт."),
    (22.0, "Не громкий словом, но сильный в деле. Евгений — мужчина, не на сцене."),
    (36.0, "Евгений — мужчина, не миф и не легенда. Сердце открыто, руки не для пустых слов."),
    (52.0, "Он не обещает горы — он их несёт. И в этом его сила, и в этом его путь."),
    (68.0, "Он помнит лица, умеет слушать. В его шаге уверенность, не бравада."),
    (84.0, "Друзья знают: если нужен он — он рядом, без пафоса. Просто мужчина."),
    (100.0, "Евгений — мужчина, с которым можно в бурю. С которым тихо у окна."),
    (116.0, "Мужчина. Надёжный. Живой. Реальный. Тот, кого не стыдно назвать своим."),
    (132.0, "Евгений — мужчина. И пусть над ним сияет этот свет."),
]


def synthesize_vocals(tmpdir: Path) -> list[tuple[float, Path]]:
    segments = []
    for i, (start, text) in enumerate(VOCAL_SECTIONS):
        mp3_path = tmpdir / f"vocal_{i}.mp3"
        gTTS(text=text, lang="ru", slow=False).save(str(mp3_path))
        segments.append((start, mp3_path))
    return segments


def mix_audio(instrumental_wav: Path, vocal_segments: list[tuple[float, Path]], out_mp3: Path) -> None:
    music = AudioSegment.from_wav(str(instrumental_wav))
    mixed = music
    for start_sec, mp3_path in vocal_segments:
        vocals = AudioSegment.from_mp3(str(mp3_path))
        vocals = vocals - 2  # slight volume adjust
        position_ms = int(start_sec * 1000)
        mixed = mixed.overlay(vocals, position=position_ms)
    mixed.export(str(out_mp3), format="mp3", bitrate="192k")


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    duration = 145.0

    with tempfile.TemporaryDirectory() as tmp:
        tmpdir = Path(tmp)
        instrumental = build_instrumental(duration)
        wav_path = tmpdir / "instrumental.wav"
        write_wav(wav_path, instrumental)

        print("Synthesizing Russian vocals...")
        vocal_segments = synthesize_vocals(tmpdir)

        print("Mixing final track...")
        mix_audio(wav_path, vocal_segments, OUTPUT_FILE)

    # Copy to workspace for visibility
    workspace_copy = Path("/workspace/audio_output/evgeniy_song.mp3")
    workspace_copy.write_bytes(OUTPUT_FILE.read_bytes())
    print(f"Done: {OUTPUT_FILE}")
    print(f"Copy: {workspace_copy}")


if __name__ == "__main__":
    main()
