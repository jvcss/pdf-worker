| Font | Page Size | Width (pt) | Height (pt) | x |    y  |
| ---- | --------- | ---------- | ----------- | - | ----- |
|  24  |     A4    |   595.29   |    841.89   | 0 | H - F |


## To convert the margin in centimeters to the position in the x and y axis for drawText method, we can use the following formula:

- For the x axis: x_position = x_margin * 28.35 + font_size
- For the y axis: y_position = page_height - (y_margin * 28.35 + font_size)