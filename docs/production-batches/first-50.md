# First 50 production devices

This is the Stage 13 image-review batch. Every record remains `draft` until a maintainer has added an original, reviewed `frontOff` asset and changed its status to `published`.

## Acceptance criteria per device

1. Verify brand, marketing name, and release year against a reliable reference.
2. Add an original transparent PNG illustration; do not extract simulator, SDK, or manufacturer assets.
3. Review the device silhouette, bezel, aspect ratio, cutout, and sensor placement.
4. Set `images.frontOff`, change `status` to `published`, then run `pnpm verify`.

## Selected records

### Apple

`apple-iphone-16e`, `apple-iphone-16`, `apple-iphone-16-plus`, `apple-iphone-16-pro`, `apple-iphone-16-pro-max`, `apple-iphone-15`, `apple-iphone-15-plus`, `apple-iphone-15-pro`, `apple-iphone-15-pro-max`, `apple-iphone-14`.

### Google

`google-pixel-9a`, `google-pixel-8a`, `google-pixel-9`, `google-pixel-9-pro`, `google-pixel-9-pro-fold`, `google-pixel-9-pro-xl`, `google-pixel-7a`, `google-pixel-8`, `google-pixel-8-pro`, `google-pixel-fold`.

### Samsung

`samsung-galaxy-a16`, `samsung-galaxy-a16-5g`, `samsung-galaxy-a26`, `samsung-galaxy-a36`, `samsung-galaxy-a56`, `samsung-galaxy-f06-5g`, `samsung-galaxy-f16`, `samsung-galaxy-f36`, `samsung-galaxy-f56`, `samsung-galaxy-m06`.

### Xiaomi

`xiaomi-15-ultra`, `xiaomi-15s-pro`, `xiaomi-civi-5-pro`, `xiaomi-poco-c71`, `xiaomi-poco-f7`, `xiaomi-poco-f7-pro`, `xiaomi-poco-f7-ultra`, `xiaomi-poco-m7`, `xiaomi-poco-x7`, `xiaomi-poco-x7-pro`.

### Huawei

`huawei-enjoy-70x`, `huawei-enjoy-80`, `huawei-nova-14`, `huawei-nova-14-pro`, `huawei-nova-y63`, `huawei-nova-y72s`, `huawei-pura-80`, `huawei-pura-80-pro`, `huawei-pura-80-pro-plus`, `huawei-pura-80-ultra`.
